/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          
          //complete this one too
          assert.equal(res.stockData.stock, 'goog', 'Correct stock symbol');
          assert.exists(res.stockData.price, 'stock price exists');
          assert.equal(res.stockData.likes, 0, 'No likes');
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'orcl', like: true})
          .end(function(err, res) {
            assert.equal(res.stockData.stock, 'orcl', 'Correct stock symbol');
            assert.exists(res.stockData.price, 'stock price exists');
            assert.equal(res.stockData.likes, 1, 'one like');
            done();
          });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'orcl', like: true})
          .end(function(err, res) {
            assert.equal(res.stockData.likes, 1, 'still one like');
            done();
          });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['goog', 'orcl']})
          .end(function(err, res) {
            assert.isArray(res.stockData, 'returned two stocks for comparison');
            assert.exists(res.stockData[0].stock, 'stock1 symbol exists');
            assert.exists(res.stockData[1].stock, 'stock2 symbol exists');
            assert.exists(res.stockData[0].price, 'stock1 price exists');
            assert.exists(res.stockData[1].price, 'stock2 price exists');
            done();
          });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['msft', 'fb'], like: true})
          .end(function(err, res) {
            assert.isArray(res.stockData, 'returned two stocks for comparison');
            assert.exists(res.stockData[0].stock, 'stock1 symbol exists');
            assert.exists(res.stockData[1].stock, 'stock2 symbol exists');
            assert.equal(res.stockData[0].rel_likes, 0, 'stock1 rel_likes');
            assert.equal(res.stockData[1].rel_likes, 0, 'stock2 rel_likes');
            done();
          });
        
      });
      
    });

});
