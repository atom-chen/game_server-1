REM 编译proto文件到服务端的src/apps/protocol/protofile/文件夹下
call pbjs -t static-module -w commonjs -o ../src/apps/protocol/protofileMsg/AuthProtoMsg.js AuthProto.proto
call pbjs -t static-module -w commonjs -o ../src/apps/protocol/protofileMsg/GameHoodleProtoMsg.js GameHoodleProto.proto
call pbjs -t static-module -w commonjs -o ../src/apps/protocol/protofileMsg/SystemProtoMsg.js SystemProto.proto
call pbjs -t static-module -w commonjs -o ../src/apps/protocol/protofileMsg/LobbyProtoMsg.js LobbyProto.proto

REM 编译proto文件到服务端的dis/apps/protocol/protofile/文件夹下
call pbjs -t static-module -w commonjs -o ../dist/apps/protocol/protofileMsg/AuthProtoMsg.js AuthProto.proto
call pbjs -t static-module -w commonjs -o ../dist/apps/protocol/protofileMsg/GameHoodleProtoMsg.js GameHoodleProto.proto
call pbjs -t static-module -w commonjs -o ../dist/apps/protocol/protofileMsg/SystemProtoMsg.js SystemProto.proto
call pbjs -t static-module -w commonjs -o ../dist/apps/protocol/protofileMsg/LobbyProtoMsg.js LobbyProto.proto

REM 编译proto文件到客户端的creator_client/assets/scripts/framework/protocol/文件夹下
REM call pbjs -t static-module -w commonjs -o ../../creator_client/assets/scripts/framework/protocol/protofileMsg/AuthProtoMsg.js AuthProto.proto
REM call pbjs -t static-module -w commonjs -o ../../creator_client/assets/scripts/framework/protocol/protofileMsg/GameHoodleProtoMsg.js GameHoodleProto.proto
REM call pbjs -t static-module -w commonjs -o ../../creator_client/assets/scripts/framework/protocol/protofileMsg/SystemProtoMsg.js SystemProto.proto

pause