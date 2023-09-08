use super::schema::balances;
use super::schema::balances::dsl::balances as all_balances;
use diesel;
use diesel::pg::PgConnection;
use diesel::prelude::*;

#[derive(Debug, Serialize, Queryable, Clone)]
pub struct Balance {
    pub id: i32,
    pub coin: String,
    pub total_quantity: String,
    pub address_balance: String,
    pub delegation: String,
    pub reward: String,
    pub price: String,
    pub balance_in_usd: String,
    pub create_timestamp: String,
    pub unbonding_delegation: String,
}

#[derive(Serialize, Deserialize, Insertable, Associations, Clone)]
#[table_name = "balances"]
pub struct NewBalance {
    pub coin: String,
    pub total_quantity: String,
    pub address_balance: String,
    pub delegation: String,
    pub unbonding_delegation: String,
    pub reward: String,
    pub price: String,
    pub balance_in_usd: String,
    pub create_timestamp: String,
}

impl Balance {
    pub fn get_all_balances(conn: &PgConnection) -> Vec<Balance> {
        all_balances
            .order(balances::id.desc())
            .limit(3)
            .load::<Balance>(conn)
            .expect("error!")
    }
    pub fn insert_balance(balances: Vec<NewBalance>, conn: &PgConnection) -> bool {
        diesel::insert_into(balances::table)
            .values(balances)
            .execute(conn)
            .is_ok()
    }
    pub fn get_balance(conn: &PgConnection, coin: String) -> Vec<Balance> {
        all_balances
            .filter(balances::coin.eq(coin.to_uppercase()))
            .order(balances::id.desc())
            .load::<Balance>(conn)
            .expect("error!")
    }
}
