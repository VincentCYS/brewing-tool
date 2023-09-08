// @generated automatically by Diesel CLI.

diesel::table! {
    balances (id) {
        id -> Int4,
        coin -> Varchar,
        total_quantity -> Varchar,
        address_balance -> Varchar,
        delegation -> Varchar,
        reward -> Varchar,
        price -> Varchar,
        balance_in_usd -> Varchar,
        create_timestamp -> Varchar,
        unbonding_delegation -> Varchar,
    }
}
