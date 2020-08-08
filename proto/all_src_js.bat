REM 编译proto文件到服务端的src/apps/protocol/protofile/文件夹下
call pbjs -t static-module -w commonjs -o ../src/apps/protocol/protofileMsg/AuthProtoMsg.js AuthProto.proto
call pbjs -t static-module -w commonjs -o ../src/apps/protocol/protofileMsg/GameHoodleProtoMsg.js GameHoodleProto.proto
call pbjs -t static-module -w commonjs -o ../src/apps/protocol/protofileMsg/SystemProtoMsg.js SystemProto.proto
pause