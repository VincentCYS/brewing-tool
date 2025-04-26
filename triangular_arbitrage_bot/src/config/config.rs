use serde::{Deserialize, Serialize};
use serde_yaml::{self};

#[derive(Debug, Serialize, Deserialize)]
pub struct TradingService {
    pub enable: bool,
    pub trading_pairs: Vec<String>,
    pub event_type: String,
    pub update_interval: String,
    pub init_investment: f64,
    pub fee_rate: f64,
    pub min_profit: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    pub trading_service: TradingService,
}

pub fn read_config() -> Config {
    let f = std::fs::File::open("config.yml").expect("Could not open file.");
    let scrape_config: Config = serde_yaml::from_reader(f).expect("Could not read values.");
    scrape_config
}
