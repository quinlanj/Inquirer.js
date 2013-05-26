var expect = require("chai").expect;
var sinon = require("sinon");
var EventEmitter = require("events").EventEmitter;

process.charm = require("../../helpers/charm");
var Input = require("../../../lib/prompts/input");

describe("`input` prompt", function() {

  beforeEach(function() {
    this.rl = new EventEmitter();
  });

  it("should use raw value from the user", function(done) {

    var input = new Input({
      message: "foo bar"
    }, this.rl);
    input.run(function(answer) {
      expect(answer).to.equal("Inquirer");
      done();
    });

    this.rl.emit("line", "Inquirer");
  });

  it("should filter the user input", function(done) {

    var input = new Input({
      message: "foo bar",
      filter: function() {
        return "pass";
      }
    }, this.rl);
    input.run(function(answer) {
      expect(answer).to.equal("pass");
      done();
    });

    this.rl.emit("line", "Inquirer");
  });

  it("should allow filter function to be asynchronous", function(done) {

    var input = new Input({
      message: "foo bar",
      filter: function() {
        var done = this.async();
        setTimeout(function() {
          done("pass");
        }, 0);
      }
    }, this.rl);
    input.run(function(answer) {
      expect(answer).to.equal("pass");
      done();
    });

    this.rl.emit("line", "Inquirer");
  });

  it("should validate the user input", function(done) {
    var self = this;
    var called = 0;
    var input = new Input({
      message: "foo bar",
      validate: function(value) {
        called++;
        expect(value).to.equal("Inquirer");
        // Make sure returning false won't continue
        if (called === 2) {
          done();
        } else {
          self.rl.emit("line", "Inquirer");
        }
        return false;
      }
    }, this.rl);
    input.run(function(answer) {
      // This should NOT be called
      expect(false).to.be.true;
    });

    this.rl.emit("line", "Inquirer");
  });

  it("should allow validate function to be asynchronous", function(continu) {
    var self = this;
    var called = 0;
    var input = new Input({
      message: "foo bar",
      validate: function(value) {
        var done = this.async();
        setTimeout(function() {
          called++;
          expect(value).to.equal("Inquirer");
          // Make sure returning false won't continue
          if (called === 2) {
            continu();
          } else {
            self.rl.emit("line", "Inquirer");
          }
          done(false);
        }, 0);
      }
    }, this.rl);

    input.run(function(answer) {
      // This should NOT be called
      expect(false).to.be.true;
    });

    this.rl.emit("line", "Inquirer");
  });

});
