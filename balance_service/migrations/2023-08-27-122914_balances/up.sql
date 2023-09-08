CREATE TABLE balances
(
    id                      SERIAL PRIMARY KEY,
    coin                    VARCHAR NOT NULL,
    total_quantity          VARCHAR NOT NULL,
    address_balance         VARCHAR NOT NULL,
    delegation              VARCHAR NOT NULL,
    unbonding_delegation    VARCHAR NOT NULL,
    reward                  VARCHAR NOT NULL,
    price                   VARCHAR NOT NULL,
    balance_in_usd          VARCHAR NOT NULL,
    create_timestamp        VARCHAR NOT NULL
)
