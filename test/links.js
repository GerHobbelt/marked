/*jslint node: true */
/*global describe:true, it: true, beforeEach:true, afterEach:true */
"use strict";

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var util = require('util');
var marked = require('..');

function getDefaultOptions() {
  return { gfm: true, tables: true, sanitize: true, breaks: true, linkify: true };
}


describe('mentions', function() {
  it('should deal with wikipedia links that contain brackets', function() {
    var text = 'Testing a link http://en.wikipedia.org/wiki/Order_(biology) should work';
    var options = getDefaultOptions();

    var lexer = new marked.Lexer(options);
    var links = 0;
    var renderer = new marked.Renderer();

    renderer.link = function(href, title, text) {
      links++;
      var out = '<a href="' + href + '">' + text + '</a>';
      assert.equal(href, 'http://en.wikipedia.org/wiki/Order_(biology)');
      assert.equal(text, 'http://en.wikipedia.org/wiki/Order_(biology)');
    };

    var tokens = lexer.lex(text);
    options.renderer = renderer;

    var parser = new marked.Parser(options);
    var html = parser.parse(tokens);

    assert.equal(links, 1);
    // assert.equal(html, '<p>Deal with <a href="#" data-link-type="issue" data-issue="123" class="issue">#123</a></p>\n');
  });

  it('should exclude brackets from text that has links in it already', function() {
    var text = 'Please remember to visit my webpage (http://my-home-page.com)';
    var options = getDefaultOptions();

    var lexer = new marked.Lexer(options);
    var links = 0;
    var renderer = new marked.Renderer();

    renderer.link = function(href, title, text) {
      links++;
      var out = '<a href="' + href + '">' + text + '</a>';
      assert.equal(href, 'http://my-home-page.com');
      assert.equal(text, 'http://my-home-page.com');
    };

    var tokens = lexer.lex(text);
    options.renderer = renderer;

    var parser = new marked.Parser(options);
    var html = parser.parse(tokens);

    assert.equal(links, 1);
    // assert.equal(html, '<p>Deal with <a href="#" data-link-type="issue" data-issue="123" class="issue">#123</a></p>\n');
  });

  it('should exclude brackets from text that has links in it already', function() {
    var text = 'Please remember to visit my webpage (http://my-home-page.com) http://en.wikipedia.org/wiki/Order_(biology)';
    var options = getDefaultOptions();

    var lexer = new marked.Lexer(options);
    var links = 0;
    var renderer = new marked.Renderer();

    renderer.link = function(href, title, text) {
      if(links++ === 0) {
        assert.equal(href, 'http://my-home-page.com');
        assert.equal(text, 'http://my-home-page.com');
      } else {
        assert.equal(href, 'http://en.wikipedia.org/wiki/Order_(biology)');
        assert.equal(text, 'http://en.wikipedia.org/wiki/Order_(biology)');
      }

      return '<a href="' + href + '">' + text + '</a>';
    };

    var tokens = lexer.lex(text);
    options.renderer = renderer;

    var parser = new marked.Parser(options);
    var html = parser.parse(tokens);

    assert.equal(links, 2);
    // assert.equal(html, '<p>Deal with <a href="#" data-link-type="issue" data-issue="123" class="issue">#123</a></p>\n');
  });

});