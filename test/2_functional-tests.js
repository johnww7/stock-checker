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
        .query({stock: 'amd'})
        .end(function(err, res){
          
          assert.equal(res.body.stockData.stock, 'AMD', 'Correct stock symbol');
          assert.equal(res.body.stockData.likes, 0, 'No likes');
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'fb', like: true})
          .end(function(err, res) {
            assert.equal(res.body.stockData.stock, 'FB', 'Correct stock symbol');
            assert.equal(res.body.stockData.likes, 1, 'one like');
            done();
          });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'fb', like: true})
          .end(function(err, res) {
            assert.equal(res.body.stockData.likes, 1, 'still one like');
            done();
          });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['goog', 'orcl']})
          .end(function(err, res) {
            assert.isArray(res.body.stockData, 'returned two stocks for comparison');
            assert.equal(res.body.stockData[0].stock, 'GOOG','stock1 symbol exists');
            assert.equal(res.body.stockData[1].stock, 'ORCL','stock2 symbol exists');
            done();
          });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['msft', 'fb'], like: true})
          .end(function(err, res) {
            assert.isArray(res.body.stockData, 'returned two stocks for comparison');
            assert.equal(res.body.stockData[0].rel_likes, 0, 'stock1 rel_likes');
            assert.equal(res.body.stockData[1].rel_likes, 0, 'stock2 rel_likes');
            done();
          });
        
      });
      
    });

});
