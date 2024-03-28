import beaker
import pyteal as pt

class AppState:
    # Global state
    beneficiary = beaker.GlobalStateValue(
        stack_type = pt.TealType.bytes,
        descr = "People in need",
        default = pt.Bytes("")
    )

    organization = beaker.GlobalStateValue(
        stack_type = pt.TealType.bytes,
        descr = "Charity organization",
        default = pt.Bytes("")
    )

    cause = beaker.GlobalStateValue(
        stack_type = pt.TealType.bytes,
        descr = "Cause",
        default = pt.Bytes("")
    )

    wager = beaker.GlobalStateValue(
        stack_type = pt.TealType.uint64,
        descr = "Recources needed",
        default = pt.Int(0)
    )

    currently_raised = beaker.GlobalStateValue(
        stack_type = pt.TealType.uint64,
        descr = "Currently raised funds",
        default = pt.Int(0)
    )

    approved_by = beaker.GlobalStateValue(
        stack_type = pt.TealType.bytes,
        descr = "Trusted entity that approved the project",
        default = pt.Bytes("")
    )


app = beaker.Application("Charityverse", descr = "dApp for funding charitable causes", state=AppState)

# Methods

# create - initializes global state
@app.create(bare=True)
def create() -> pt.Expr:
    return pt.Seq(app.initialize_global_state(), app.state.organization.set(pt.Txn.sender()))

# opt-in
@app.opt_in(bare=True)
def opt_in() -> pt.Expr:
    return pt.Seq(
        app.initialize_local_state(),
        pt.Approve()
    )

@app.external(authorize=beaker.Authorize.only_creator())
def set_up_fundraiser(amount: pt.abi.Uint64, cause: pt.abi.String, address: pt.abi.Account) -> pt.Expr:
    return pt.Seq(
        pt.Assert(pt.Txn.sender() == app.state.organization),
        app.state.wager.set(amount.get()),
        app.state.cause.set(cause.get()),
        app.state.beneficiary.set(address.address())
    )

@app.external(authorize=beaker.Authorize.opted_in())
def approve() -> pt.Expr:
    return pt.Seq(
        pt.Assert(pt.Txn.sender() != app.state.organization),
        app.state.approved_by.set(pt.Txn.sender())
    )

@app.external(authorize=beaker.Authorize.opted_in())
def donate(payment: pt.abi.PaymentTransaction, *, output: pt.abi.String) -> pt.Expr:
    return pt.Seq(
        pt.Assert(
            app.state.approved_by != pt.Bytes(""),
            app.state.cause.get() != pt.Bytes(""),
            payment.type_spec().txn_type_enum() == pt.TxnType.Payment,
            payment.get().receiver() == pt.Global.current_application_address()
        ),
        app.state.currently_raised.set(pt.Add(app.state.currently_raised.get(), pt.Div(payment.get().amount(), pt.Int(1000000)))),
        output.set(pt.Bytes("Hvala Vam na donaciji"))
    )

@app.external(authorize=beaker.Authorize.only(app.state.beneficiary))
def release_funds():
    return pt.Seq(
        pt.Assert(app.state.currently_raised >= app.state.wager),
        pt.InnerTxnBuilder.Execute(
            {
                pt.TxnField.type_enum: pt.TxnType.Payment,
                pt.TxnField.sender: pt.Global.current_application_address(),
                pt.TxnField.receiver: pt.Txn.sender(),
                pt.TxnField.amount: pt.Mul(app.state.wager.get(), pt.Int(1000000))
            }
        )
    )
