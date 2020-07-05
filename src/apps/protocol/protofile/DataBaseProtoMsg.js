/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.DataBaseProto = (function() {

    /**
     * Namespace DataBaseProto.
     * @exports DataBaseProto
     * @namespace
     */
    var DataBaseProto = {};

    /**
     * Cmd enum.
     * @name DataBaseProto.Cmd
     * @enum {string}
     * @property {number} INVALED=0 INVALED value
     * @property {number} eAuthUinfoReq=1 eAuthUinfoReq value
     * @property {number} eAuthUinfoRes=2 eAuthUinfoRes value
     */
    DataBaseProto.Cmd = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "INVALED"] = 0;
        values[valuesById[1] = "eAuthUinfoReq"] = 1;
        values[valuesById[2] = "eAuthUinfoRes"] = 2;
        return values;
    })();

    DataBaseProto.AuthUinfoReq = (function() {

        /**
         * Properties of an AuthUinfoReq.
         * @memberof DataBaseProto
         * @interface IAuthUinfoReq
         * @property {string|null} [uname] AuthUinfoReq uname
         * @property {string|null} [upwd] AuthUinfoReq upwd
         */

        /**
         * Constructs a new AuthUinfoReq.
         * @memberof DataBaseProto
         * @classdesc Represents an AuthUinfoReq.
         * @implements IAuthUinfoReq
         * @constructor
         * @param {DataBaseProto.IAuthUinfoReq=} [properties] Properties to set
         */
        function AuthUinfoReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AuthUinfoReq uname.
         * @member {string} uname
         * @memberof DataBaseProto.AuthUinfoReq
         * @instance
         */
        AuthUinfoReq.prototype.uname = "";

        /**
         * AuthUinfoReq upwd.
         * @member {string} upwd
         * @memberof DataBaseProto.AuthUinfoReq
         * @instance
         */
        AuthUinfoReq.prototype.upwd = "";

        /**
         * Creates a new AuthUinfoReq instance using the specified properties.
         * @function create
         * @memberof DataBaseProto.AuthUinfoReq
         * @static
         * @param {DataBaseProto.IAuthUinfoReq=} [properties] Properties to set
         * @returns {DataBaseProto.AuthUinfoReq} AuthUinfoReq instance
         */
        AuthUinfoReq.create = function create(properties) {
            return new AuthUinfoReq(properties);
        };

        /**
         * Encodes the specified AuthUinfoReq message. Does not implicitly {@link DataBaseProto.AuthUinfoReq.verify|verify} messages.
         * @function encode
         * @memberof DataBaseProto.AuthUinfoReq
         * @static
         * @param {DataBaseProto.IAuthUinfoReq} message AuthUinfoReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AuthUinfoReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.uname != null && message.hasOwnProperty("uname"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.uname);
            if (message.upwd != null && message.hasOwnProperty("upwd"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.upwd);
            return writer;
        };

        /**
         * Encodes the specified AuthUinfoReq message, length delimited. Does not implicitly {@link DataBaseProto.AuthUinfoReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof DataBaseProto.AuthUinfoReq
         * @static
         * @param {DataBaseProto.IAuthUinfoReq} message AuthUinfoReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AuthUinfoReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AuthUinfoReq message from the specified reader or buffer.
         * @function decode
         * @memberof DataBaseProto.AuthUinfoReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {DataBaseProto.AuthUinfoReq} AuthUinfoReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AuthUinfoReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DataBaseProto.AuthUinfoReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.uname = reader.string();
                    break;
                case 2:
                    message.upwd = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AuthUinfoReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof DataBaseProto.AuthUinfoReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {DataBaseProto.AuthUinfoReq} AuthUinfoReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AuthUinfoReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AuthUinfoReq message.
         * @function verify
         * @memberof DataBaseProto.AuthUinfoReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AuthUinfoReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.uname != null && message.hasOwnProperty("uname"))
                if (!$util.isString(message.uname))
                    return "uname: string expected";
            if (message.upwd != null && message.hasOwnProperty("upwd"))
                if (!$util.isString(message.upwd))
                    return "upwd: string expected";
            return null;
        };

        /**
         * Creates an AuthUinfoReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof DataBaseProto.AuthUinfoReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {DataBaseProto.AuthUinfoReq} AuthUinfoReq
         */
        AuthUinfoReq.fromObject = function fromObject(object) {
            if (object instanceof $root.DataBaseProto.AuthUinfoReq)
                return object;
            var message = new $root.DataBaseProto.AuthUinfoReq();
            if (object.uname != null)
                message.uname = String(object.uname);
            if (object.upwd != null)
                message.upwd = String(object.upwd);
            return message;
        };

        /**
         * Creates a plain object from an AuthUinfoReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof DataBaseProto.AuthUinfoReq
         * @static
         * @param {DataBaseProto.AuthUinfoReq} message AuthUinfoReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AuthUinfoReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.uname = "";
                object.upwd = "";
            }
            if (message.uname != null && message.hasOwnProperty("uname"))
                object.uname = message.uname;
            if (message.upwd != null && message.hasOwnProperty("upwd"))
                object.upwd = message.upwd;
            return object;
        };

        /**
         * Converts this AuthUinfoReq to JSON.
         * @function toJSON
         * @memberof DataBaseProto.AuthUinfoReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AuthUinfoReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AuthUinfoReq;
    })();

    DataBaseProto.AuthUinfoRes = (function() {

        /**
         * Properties of an AuthUinfoRes.
         * @memberof DataBaseProto
         * @interface IAuthUinfoRes
         * @property {number|null} [status] AuthUinfoRes status
         * @property {string|null} [result] AuthUinfoRes result
         */

        /**
         * Constructs a new AuthUinfoRes.
         * @memberof DataBaseProto
         * @classdesc Represents an AuthUinfoRes.
         * @implements IAuthUinfoRes
         * @constructor
         * @param {DataBaseProto.IAuthUinfoRes=} [properties] Properties to set
         */
        function AuthUinfoRes(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AuthUinfoRes status.
         * @member {number} status
         * @memberof DataBaseProto.AuthUinfoRes
         * @instance
         */
        AuthUinfoRes.prototype.status = 0;

        /**
         * AuthUinfoRes result.
         * @member {string} result
         * @memberof DataBaseProto.AuthUinfoRes
         * @instance
         */
        AuthUinfoRes.prototype.result = "";

        /**
         * Creates a new AuthUinfoRes instance using the specified properties.
         * @function create
         * @memberof DataBaseProto.AuthUinfoRes
         * @static
         * @param {DataBaseProto.IAuthUinfoRes=} [properties] Properties to set
         * @returns {DataBaseProto.AuthUinfoRes} AuthUinfoRes instance
         */
        AuthUinfoRes.create = function create(properties) {
            return new AuthUinfoRes(properties);
        };

        /**
         * Encodes the specified AuthUinfoRes message. Does not implicitly {@link DataBaseProto.AuthUinfoRes.verify|verify} messages.
         * @function encode
         * @memberof DataBaseProto.AuthUinfoRes
         * @static
         * @param {DataBaseProto.IAuthUinfoRes} message AuthUinfoRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AuthUinfoRes.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.status != null && message.hasOwnProperty("status"))
                writer.uint32(/* id 1, wireType 0 =*/8).sint32(message.status);
            if (message.result != null && message.hasOwnProperty("result"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.result);
            return writer;
        };

        /**
         * Encodes the specified AuthUinfoRes message, length delimited. Does not implicitly {@link DataBaseProto.AuthUinfoRes.verify|verify} messages.
         * @function encodeDelimited
         * @memberof DataBaseProto.AuthUinfoRes
         * @static
         * @param {DataBaseProto.IAuthUinfoRes} message AuthUinfoRes message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AuthUinfoRes.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AuthUinfoRes message from the specified reader or buffer.
         * @function decode
         * @memberof DataBaseProto.AuthUinfoRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {DataBaseProto.AuthUinfoRes} AuthUinfoRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AuthUinfoRes.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DataBaseProto.AuthUinfoRes();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.status = reader.sint32();
                    break;
                case 2:
                    message.result = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AuthUinfoRes message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof DataBaseProto.AuthUinfoRes
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {DataBaseProto.AuthUinfoRes} AuthUinfoRes
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AuthUinfoRes.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AuthUinfoRes message.
         * @function verify
         * @memberof DataBaseProto.AuthUinfoRes
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AuthUinfoRes.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isInteger(message.status))
                    return "status: integer expected";
            if (message.result != null && message.hasOwnProperty("result"))
                if (!$util.isString(message.result))
                    return "result: string expected";
            return null;
        };

        /**
         * Creates an AuthUinfoRes message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof DataBaseProto.AuthUinfoRes
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {DataBaseProto.AuthUinfoRes} AuthUinfoRes
         */
        AuthUinfoRes.fromObject = function fromObject(object) {
            if (object instanceof $root.DataBaseProto.AuthUinfoRes)
                return object;
            var message = new $root.DataBaseProto.AuthUinfoRes();
            if (object.status != null)
                message.status = object.status | 0;
            if (object.result != null)
                message.result = String(object.result);
            return message;
        };

        /**
         * Creates a plain object from an AuthUinfoRes message. Also converts values to other types if specified.
         * @function toObject
         * @memberof DataBaseProto.AuthUinfoRes
         * @static
         * @param {DataBaseProto.AuthUinfoRes} message AuthUinfoRes
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AuthUinfoRes.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.status = 0;
                object.result = "";
            }
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            if (message.result != null && message.hasOwnProperty("result"))
                object.result = message.result;
            return object;
        };

        /**
         * Converts this AuthUinfoRes to JSON.
         * @function toJSON
         * @memberof DataBaseProto.AuthUinfoRes
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AuthUinfoRes.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AuthUinfoRes;
    })();

    return DataBaseProto;
})();

module.exports = $root;
