/*
Navicat MySQL Data Transfer

Source Server         : hccfun
Source Server Version : 50505
Source Host           : 121.41.0.245:3306
Source Database       : auth_center

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2020-05-25 01:06:34
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for uinfo
-- ----------------------------
DROP TABLE IF EXISTS `uinfo`;
CREATE TABLE `uinfo` (
  `uid` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '玩家唯一的UID号,仅供服务端识别使用',
  `numberid` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '玩家numberid,识别第几号用户',
  `areaid` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '地区areaid,识别地区',
  `unick` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '""' COMMENT '玩家的昵称',
  `usex` int(8) NOT NULL DEFAULT '0' COMMENT '0:男, 1:女的',
  `uface` int(8) NOT NULL DEFAULT '0' COMMENT '系统默认图像，自定义图像后面再加上',
  `uname` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '""' COMMENT '玩家的账号名称',
  `upwd` varchar(32) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '""' COMMENT '玩家密码的MD5值',
  `uphone` varchar(16) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '""' COMMENT '玩家的电话',
  `uemail` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '""' COMMENT '玩家的email',
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '""' COMMENT '玩家的地址',
  `uvip` int(8) NOT NULL DEFAULT '0' COMMENT '玩家VIP的等级，这个是最普通的',
  `vip_endtime` int(32) NOT NULL DEFAULT '0' COMMENT '玩家VIP到期的时间撮',
  `is_guest` int(8) NOT NULL DEFAULT '0' COMMENT '标志改账号是否为游客账号',
  `guest_key` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '0' COMMENT '游客账号的唯一的key',
  `status` int(8) NOT NULL DEFAULT '0' COMMENT '0表示正常，其他根据需求定',
  `avatarurl` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '""' COMMENT '微信头像地址',
  `unionid` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '""' COMMENT '微信唯一unionid',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1932 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='存放我们的玩家信息';

-- ----------------------------
-- Records of uinfo
-- ----------------------------
INSERT INTO `uinfo` VALUES ('1899', '1000001', '0', 'user1000001', '0', '3', 'test1111', '111111', '\"\"', '\"\"', '\"\"', '0', '0', '0', '0', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1901', '1001901', '0', 'user1001901', '0', '9', 'test2222', '111111', '\"\"', '\"\"', '\"\"', '0', '0', '0', '0', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1902', '1001902', '0', 'user1001902', '0', '2', 'test3333', '111111', '\"\"', '\"\"', '\"\"', '0', '0', '0', '0', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1903', '1001903', '0', 'user1001903', '1', '9', 'test4444', '111111', '\"\"', '\"\"', '\"\"', '0', '0', '0', '0', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1904', '1001904', '0', 'user1001904', '0', '3', 'test5555', '111111', '\"\"', '\"\"', '\"\"', '0', '0', '0', '0', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1905', '1001905', '0', 'user1001905', '1', '4', 'test6666', '111111', '\"\"', '\"\"', '\"\"', '0', '0', '0', '0', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1906', '1001906', '0', 'user1001906', '1', '8', 'test7777', '111111', '\"\"', '\"\"', '\"\"', '0', '0', '0', '0', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1907', '1001907', '0', 'user1001907', '1', '5', 'test8888', '111111', '\"\"', '\"\"', '\"\"', '0', '0', '0', '0', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1908', '1001908', '0', 'user1001908', '1', '8', 'test9999', '111111', '\"\"', '\"\"', '\"\"', '0', '0', '0', '0', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1910', '1001909', '0', 'C小C????', '1', '0', '\"\"', '\"\"', '\"\"', '\"\"', 'China-Zhejiang-Hangzhou', '0', '0', '0', '0', '0', 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLQoDgahGVTFb6H74TZz9z5OI9RoXWmXJ6WXbWsfvWKCAD5KCdaYfdJZCf8aR0N4oP5bKXImelbkw/132', 'oaCkmwOd91uU-3oX78pJ59PFndGs');
INSERT INTO `uinfo` VALUES ('1911', '1001911', '0', 'guest1001911', '0', '4', '\"\"', '\"\"', '\"\"', '\"\"', '\"\"', '0', '0', '1', 'TnhSy7aP7TkK7MN2rppYTs2aKM6jicF7', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1912', '1001912', '0', 'guest1001912', '0', '9', '\"\"', '\"\"', '\"\"', '\"\"', '\"\"', '0', '0', '1', 'nM5irPKdfYX6dJP8RPJKR5G6f7ZGx2pe', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1913', '1001913', '0', 'guest1001913', '0', '8', '\"\"', '\"\"', '\"\"', '\"\"', '\"\"', '0', '0', '1', 'C4wkp84z4TbMJbmfyaYmYcCW2em43Biz', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1914', '1001914', '0', 'guest1001914', '0', '8', '\"\"', '\"\"', '\"\"', '\"\"', '\"\"', '0', '0', '1', 'pfhndH8A6ebMM225p5kdMn5sDeK2xNsF', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1915', '1001915', '0', '大虾米', '0', '0', '\"\"', '\"\"', '\"\"', '\"\"', 'unknown-unknown-unknown', '0', '0', '0', '0', '0', 'https://wx.qlogo.cn/mmopen/vi_32/OKWDZRD96YmF1xyTpMvrXDUs1fPJBnFibCGrWD1EuKO3jaIJVUamv8BoVLpDkSAzz1qTfwicYWY6CZrPicuqq4UIQ/132', 'oaCkmwJH3e_jDNRM-kc4K-1OhzY8');
INSERT INTO `uinfo` VALUES ('1916', '1001916', '0', '小星星', '1', '0', '\"\"', '\"\"', '\"\"', '\"\"', 'Poland-unknown-unknown', '0', '0', '0', '0', '0', 'https://wx.qlogo.cn/mmopen/vi_32/rnzvIFJbbVnlXic31C7fUibWeyN1ys8s7tPRsdSTF30eGyhzBHUmmg8uR6swL0aLnK4LcAsJpzCh1gC5dDUW3GaA/132', 'oaCkmwH6yIkReyRoIec5nIg7_Ebw');
INSERT INTO `uinfo` VALUES ('1917', '1001917', '0', 'guest1001917', '0', '2', '\"\"', '\"\"', '\"\"', '\"\"', '\"\"', '0', '0', '1', 'HdGt5d73rWwQ2DwYMwEXSPGEtpyFPPH3', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1918', '1001918', '0', 'guest1001918', '0', '4', '\"\"', '\"\"', '\"\"', '\"\"', '\"\"', '0', '0', '1', 'pznEXfB3xTJXR5M7AXSw74sM3GWNCQkd', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1919', '1001919', '0', 'guest1001919', '1', '9', '\"\"', '\"\"', '\"\"', '\"\"', '\"\"', '0', '0', '1', 'i5aANJrF5tDQHJYS8knZJJBEx3Amw4Bd', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1920', '1001920', '0', 'guest1001920', '1', '3', '\"\"', '\"\"', '\"\"', '\"\"', '\"\"', '0', '0', '1', 'xxPipwADGPHJnsDxsJDYQysDD28WxSWZ', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1921', '1001921', '0', 'guest1001921', '0', '7', '\"\"', '\"\"', '\"\"', '\"\"', '\"\"', '0', '0', '1', 'TREGmnW3tBsDhbBHy5YJZ5RdZZZC7QSJ', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1922', '1001922', '0', 'guest1001922', '1', '2', '\"\"', '\"\"', '\"\"', '\"\"', '\"\"', '0', '0', '1', 'XQBAdph5wnXEJX4z838Nef6He2kaMGAP', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1923', '1001923', '0', 'guest1001923', '0', '1', '\"\"', '\"\"', '\"\"', '\"\"', '\"\"', '0', '0', '1', 'TD7z3WdpTCH2i2Cc8sYhQaWa6fJJrHHJ', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1924', '1001924', '0', 'guest1001924', '1', '5', '\"\"', '\"\"', '\"\"', '\"\"', '\"\"', '0', '0', '1', 'pBGsjKnyG6yWrYRpe244mJi8fizAMHzC', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1925', '1001925', '0', 'guest1001925', '1', '9', '\"\"', '\"\"', '\"\"', '\"\"', '\"\"', '0', '0', '1', 'skNPcfbbJpFfxtsEsa7abhWHC7jGEED7', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1926', '1001926', '0', 'user1001926', '1', '5', 'wanxiao123', 'wanxiao', '\"\"', '\"\"', '\"\"', '0', '0', '0', '0', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1927', '1001927', '0', 'guest1001927', '0', '9', '\"\"', '\"\"', '\"\"', '\"\"', '\"\"', '0', '0', '1', 'szd3mTZK4N3MYztaEE3XY2f2xcF6f6AB', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1928', '1001928', '0', 'guest1001928', '1', '1', '\"\"', '\"\"', '\"\"', '\"\"', '\"\"', '0', '0', '1', 'ADG72Kn4rGcMwFRsGpEeS3zKPa3PpaYk', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1929', '1001929', '0', 'guest1001929', '0', '1', '\"\"', '\"\"', '\"\"', '\"\"', '\"\"', '0', '0', '1', 'j4HHRRGHpSSwKnYDkDMns7rBZPezKXhX', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1930', '1001930', '0', 'guest1001930', '1', '3', '\"\"', '\"\"', '\"\"', '\"\"', '\"\"', '0', '0', '1', 'rbZ5PykwYrTHT358tZaSNW4bQTi8mQGj', '0', '\"\"', '\"\"');
INSERT INTO `uinfo` VALUES ('1931', '1001931', '0', 'guest1001931', '1', '8', '\"\"', '\"\"', '\"\"', '\"\"', '\"\"', '0', '0', '1', 'rSPHztFfZ3mSGs3j7ZtjhxDG7wHADrAb', '0', '\"\"', '\"\"');
