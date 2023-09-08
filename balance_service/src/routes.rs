use super::db::Conn as DbConn;
use super::models::{Balance, NewBalance};
use rocket_contrib::json::Json;
use serde_json::Value;

#[get("/balances")]
pub fn get_all(conn: DbConn) -> Json<Value> {
    let balances = Balance::get_all_balances(&conn);
    let mut total_balance = 0.0;
    let balance_list = balances.to_vec();

    for balance in balance_list {
        let balance_in_usd: Result<f64, std::num::ParseFloatError> =
            balance.balance_in_usd.parse::<f64>();

        println!("===> {:?}", balance);
        match balance_in_usd {
            Ok(balance) => total_balance = total_balance + balance,
            Err(err) => println!("{:?}", err),
        }
    }
    Json(json!({
        "status": 200,
        "result": balances,
        "total_balance" : total_balance
    }))
}

#[post("/newBalances", format = "application/json", data = "<new_balances>")]
pub fn new_balance(conn: DbConn, new_balances: Json<Vec<NewBalance>>) -> Json<Value> {
    Json(json!({
        "status": Balance::insert_balance(new_balances.to_vec(), &conn),
        "result": Balance::get_all_balances(&conn).first(),
    }))
}

#[get("/balance/<coin>")]
pub fn find_balance(conn: DbConn, coin: String) -> Json<Value> {
    Json(json!({
        "status": 200,
        "result":  Balance::get_balance(&conn, coin),
    }))
}
