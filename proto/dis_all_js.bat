REM 编译proto文件到服务端的src/apps/protocol/protofile/文件夹下
call pbjs -t static-module -w commonjs -o ../dist/apps/protocol/protofile/AuthProtoMsg.js AuthProto.proto
call pbjs -t static-module -w commonjs -o ../dist/apps/protocol/protofile/GameHoodleProtoMsg.js GameHoodleProto.proto
call pbjs -t static-module -w commonjs -o ../dist/apps/protocol/protofile/SystemProtoMsg.js SystemProto.proto
call pbjs -t static-module -w commonjs -o ../dist/apps/protocol/protofile/DataBaseProtoMsg.js DataBaseProto.proto
pause