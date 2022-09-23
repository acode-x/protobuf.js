"use strict";
var protobuf = module.exports = require("./index-minimal");

protobuf.build = "light";

// Serialization
protobuf.encoder          = require("./encoder");
protobuf.decoder          = require("./decoder");
protobuf.converter        = require("./converter");

// Reflection
protobuf.ReflectionObject = require("./object");
protobuf.Namespace        = require("./namespace");
protobuf.Root             = require("./root");
protobuf.Enum             = require("./enum");
protobuf.Type             = require("./type");
protobuf.Field            = require("./field");
protobuf.OneOf            = require("./oneof");
protobuf.MapField         = require("./mapfield");

// Runtime
protobuf.Message          = require("./message");
protobuf.wrappers         = require("./wrappers");

// Utility
protobuf.types            = require("./types");
protobuf.util             = require("./util");

// Parser
protobuf.tokenize         = require("./tokenize");
protobuf.parse            = require("./parse");
protobuf.common           = require("./common");

// Set up possibly cyclic reflection dependencies
protobuf.ReflectionObject._configure(protobuf.Root);
protobuf.Namespace._configure(protobuf.Type, protobuf.Enum);
protobuf.Root._configure(protobuf.Type);
protobuf.Field._configure(protobuf.Type);

// Configure parser
protobuf.Root._configure(protobuf.Type, protobuf.parse, protobuf.common);

/**
 * Loads an array of .proto files(string) and returns root
 * @param {string|string[]} protofiles One or multiple files(string) to load
 * @returns {Root} Root namespace
 */
 function init(protofiles) {
    var root = new protobuf.Root();
    var i;
    for (i = 0; i < protofiles.length; i++) {
        protobuf.parse(protofiles[i], root, { keepCase: true, alternateCommentMode: true });
    }
    root.addJSON(protobuf.common.get("google/protobuf/empty.proto").nested);
    root.addJSON(protobuf.common.get("google/protobuf/any.proto").nested);
    root.addJSON(protobuf.common.get("google/protobuf/timestamp.proto").nested);
    root.resolveAll();
    return root;
}

protobuf.init = init;
