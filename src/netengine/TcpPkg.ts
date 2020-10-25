class TcpPkg {
    static read_pkg_size(pkg_data: Buffer, offset: number) {
        if (offset > pkg_data.length - 2) {
            return -1; 
        }
        return pkg_data.readUInt16LE(offset); //小尾
    }

    static package_data(data: Buffer) {
        let buf = Buffer.allocUnsafe(2 + data.length);
        buf.writeInt16LE(2 + data.length, 0);
        buf.fill(data, 2);
        return buf;
    }

    //tcp粘包处理
    //last_package：上次没接收完整的包
    // recv_data: 当前接收到的数据包
    //cmd_callback: 回调，返回一个完整的包
    static handle_package_data(last_package: Buffer, recv_data: Buffer, cmd_callback: Function) {
        if (!recv_data) {
            return null;
        }
        // Log.info("handle_package_data111")
        let last_pkg: any = last_package;
        let data = recv_data;
        if (last_pkg != null) { //上一次剩余没有处理完的半包;
            last_pkg = Buffer.concat([last_pkg, data], last_pkg.length + data.length);
        }
        else {
            last_pkg = data
        }
        // Log.info("handle_package_data222")
        let pkg_len = TcpPkg.read_pkg_size(last_pkg, 0);
        if (pkg_len <= 2 || pkg_len <= 0) {
            return null;
        }
        let offset = 0;
        let HEAD_LEN = 2; //2个长度信息
        // Log.info("handle_package_data333,offset: "+ offset , "pkg_len: "+ pkg_len ,"last_pkg_len: " + last_pkg.length)
        while (offset + pkg_len <= last_pkg.length) { //判断是否有完整的包;
            // 根据长度信息来读取数据
            let cmd_buf = null;
            // 收到了一个完整的数据包
            cmd_buf = Buffer.allocUnsafe(pkg_len - HEAD_LEN);
            last_pkg.copy(cmd_buf, 0, offset + HEAD_LEN, offset + pkg_len);
            if (cmd_callback) {
                // Log.info("handle_package_data9999")
                cmd_callback(cmd_buf)
            }
            // Log.info("handle_package_data444")
            offset += pkg_len;
            if (offset >= last_pkg.length) { //正好包处理完了
                break;
            }

            pkg_len = TcpPkg.read_pkg_size(last_pkg, offset);
            if (pkg_len < 0) {
                break;
            }
        }

        // 能处理的数据包已经处理完成了,保存 0.几个包的数据
        if (offset >= last_pkg.length) {
            last_pkg = null;
        }
        else {
            let buf = Buffer.allocUnsafe(last_pkg.length - offset);
            last_pkg.copy(buf, 0, offset, last_pkg.length);
            last_pkg = buf;
        }

        // Log.info("handle_package_data555")
        return last_pkg
    }
}

export default TcpPkg;