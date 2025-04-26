use binance::{
    model::Asks,
    model::{Bids, DepthOrderBookEvent},
};

use crate::domain::trading_pair_entity::TradingPairEntity;

pub struct TradingHandler {
    pair1: TradingPairEntity,
    pair2: TradingPairEntity,
    pair3: TradingPairEntity,
    qty: f64,
    min_profit: f64,
    fee_rate: f64,
}

impl TradingHandler {
    pub fn new(
        pair1: TradingPairEntity,
        pair2: TradingPairEntity,
        pair3: TradingPairEntity,
        qty: f64,
        min_profit: f64,
        fee_rate: f64,
    ) -> Self {
        Self {
            pair1,
            pair2,
            pair3,
            qty,
            min_profit,
            fee_rate,
        }
    }

    pub fn check_possible_trade_event(&mut self, depth_order_book: DepthOrderBookEvent) {
        let (mut p1_qty, mut p2_qty) = (0.0, 0.0);
        // bid
        if depth_order_book.asks.len() > 0 {
            let ask: Asks = depth_order_book.asks[0].clone();
            if depth_order_book.symbol == self.pair1.symbol && ask.qty * ask.price >= self.qty {
                p1_qty = self.qty / ask.price;
                Self::set_ask(&mut self.pair1, &ask, depth_order_book.event_time);
            }

            if depth_order_book.symbol == self.pair2.symbol && ask.qty * ask.price >= self.pair1.qty
            {
                p2_qty = p1_qty / ask.price;
                Self::set_ask(&mut self.pair2, &ask, depth_order_book.event_time);
            }
        }

        // ask
        if depth_order_book.bids.len() > 0 && p2_qty > 0.0 {
            let bid: Bids = depth_order_book.bids[0].clone();
            if depth_order_book.symbol == self.pair3.symbol
                && bid.qty >= self.pair2.qty
                && self.pair2.qty > 0.0
            {
                Self::set_bid(&mut self.pair3, &bid, depth_order_book.event_time);
            }
        }

        // simulate trade
        Self::simulate_trade(self);
    }

    fn simulate_trade(&mut self) {
        let product_rate = Self::calculate_product_rate(self);
        // println!("{:?}", product_rate);
        // profitable when product rate > 0
        if product_rate > 0.0 {
            self.pair1.qty = self.qty / self.pair1.price;
            self.pair2.qty = self.pair1.qty / self.pair2.price;
            self.pair3.qty = self.pair2.qty * self.pair2.price;

            Self::print_simulate_trade(self, &product_rate);
        }
    }

    fn print_simulate_trade(&mut self, product_rate: &f64) {
        if *product_rate * self.qty > self.min_profit {
            let milliseconds_timestamp: u128 = std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_millis();

            println!("\n");

            Self::print_profit_and_loss(self.pair1.to_owned(), &milliseconds_timestamp);
            Self::print_profit_and_loss(self.pair2.to_owned(), &milliseconds_timestamp);
            Self::print_profit_and_loss(self.pair3.to_owned(), &milliseconds_timestamp);

            println!("P/L: {:?} USDT", *product_rate * self.qty);

            Self::reset(&mut self.pair1);
            Self::reset(&mut self.pair2);
            Self::reset(&mut self.pair3);
        }
    }

    fn calculate_product_rate(&mut self) -> f64 {
        let mut product_rate = 0.0;
        if self.pair1.price > 0.0 && self.pair2.price > 0.0 && self.pair3.price > 0.0 {
            let p1_product_rate = (1.0 / self.pair1.price) * (1.0 - self.fee_rate);
            let p2_product_rate = (1.0 / self.pair2.price) * (1.0 - self.fee_rate);
            let p3_product_rate = self.pair3.price * (1.0 - self.fee_rate);

            product_rate = p1_product_rate * p2_product_rate * p3_product_rate - 1.0;
        }

        product_rate
    }

    fn print_profit_and_loss(pair: TradingPairEntity, milliseconds_timestamp: &u128) {
        println!(
            "{:?} Qty: {:?}@{:?} latency: {:?}ms",
            pair.symbol,
            pair.qty,
            pair.price,
            milliseconds_timestamp - (pair.event_time as u128),
        );
    }

    fn reset(pair: &mut TradingPairEntity) {
        pair.price = 0.0;
        pair.qty = 0.0;
        pair.event_time = 0;
    }

    fn set_ask(pair: &mut TradingPairEntity, ask: &Asks, event_time: u64) {
        pair.price = ask.price;
        pair.qty = ask.qty;
        pair.event_time = event_time;
    }

    fn set_bid(pair: &mut TradingPairEntity, bid: &Bids, event_time: u64) {
        pair.price = bid.price;
        pair.qty = bid.qty;
        pair.event_time = event_time;
    }
}
