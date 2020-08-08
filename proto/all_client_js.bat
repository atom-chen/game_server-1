REM 编译proto文件到客户端的creator_client/assets/scripts/framework/protocol/文件夹下
call pbjs -t static-module -w commonjs -o ../../creator_client/assets/scripts/framework/protocol/protofileMsg/AuthProtoMsg.js AuthProto.proto
call pbjs -t static-module -w commonjs -o ../../creator_client/assets/scripts/framework/protocol/protofileMsg/GameHoodleProtoMsg.js GameHoodleProto.proto
call pbjs -t static-module -w commonjs -o ../../creator_client/assets/scripts/framework/protocol/protofileMsg/SystemProtoMsg.js SystemProto.proto
pause