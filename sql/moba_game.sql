/*
Navicat MySQL Data Transfer

Source Server         : hccfun
Source Server Version : 50505
Source Host           : 121.41.0.245:3306
Source Database       : moba_game

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2020-05-25 01:06:48
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for login_bonues
-- ----------------------------
DROP TABLE IF EXISTS `login_bonues`;
CREATE TABLE `login_bonues` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户唯一id',
  `uid` int(11) NOT NULL DEFAULT '0' COMMENT '用户uid',
  `bonues` int(11) NOT NULL DEFAULT '0' COMMENT '奖励数目',
  `bonues_time` int(11) NOT NULL DEFAULT '0' COMMENT '发放奖励时间',
  `days` int(11) NOT NULL DEFAULT '0' COMMENT '连续登陆天数',
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of login_bonues
-- ----------------------------

-- ----------------------------
-- Table structure for sys_msg
-- ----------------------------
DROP TABLE IF EXISTS `sys_msg`;
CREATE TABLE `sys_msg` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID，自动增长',
  `msg` varchar(255) DEFAULT '' COMMENT '公告文字',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_msg
-- ----------------------------

-- ----------------------------
-- Table structure for ugame
-- ----------------------------
DROP TABLE IF EXISTS `ugame`;
CREATE TABLE `ugame` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '记录唯一的id号',
  `uid` int(11) NOT NULL DEFAULT '0' COMMENT '用户唯一的id号',
  `uchip` int(11) NOT NULL DEFAULT '0' COMMENT '用户的金币数目',
  `uchip2` int(11) NOT NULL DEFAULT '0' COMMENT '用户的其他货币或等价物，你自己可以设计',
  `uchip3` int(11) NOT NULL DEFAULT '0' COMMENT '用户的其他货币或等价物，你自己可以设计',
  `uvip` int(11) NOT NULL DEFAULT '0' COMMENT '用户在本游戏中的等级',
  `uvip_endtime` int(11) NOT NULL DEFAULT '0' COMMENT 'vip结束时间',
  `udata1` int(11) NOT NULL DEFAULT '0' COMMENT '用户在游戏中的道具1',
  `udata2` int(11) NOT NULL DEFAULT '0' COMMENT '用户在游戏中的道具2',
  `udata3` int(11) NOT NULL DEFAULT '0' COMMENT '用户在游戏中的道具3',
  `uexp` int(11) NOT NULL DEFAULT '0' COMMENT '用户的经验值',
  `ustatus` int(11) NOT NULL DEFAULT '0' COMMENT '0正常，其他为不正常',
  `uball_info` varchar(1024) NOT NULL DEFAULT '' COMMENT '玩家小球信息',
  `user_config` varchar(1024) NOT NULL DEFAULT '' COMMENT '玩家配置',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8 COMMENT='moba游戏数据表, 存放用户的游戏数据';

-- ----------------------------
-- Records of ugame
-- ----------------------------
INSERT INTO `ugame` VALUES ('53', '143', '1500', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('54', '148', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=0&lv_2=2&lv_3=1&lv_4=2&lv_5=2&lv_6=0&lv_7=0&lv_8=0&lv_9=0&lv_10=1', '');
INSERT INTO `ugame` VALUES ('55', '139', '1900', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('56', '145', '2390', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=1&lv_4=1&lv_5=2&lv_6=1&lv_7=3&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('57', '147', '1500', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('58', '146', '7910', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=15&lv_2=2&lv_3=2&lv_4=2&lv_5=2&lv_6=1&lv_7=0&lv_8=0&lv_9=0&lv_10=1', '');
INSERT INTO `ugame` VALUES ('59', '149', '9540', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=0&lv_2=1&lv_3=4&lv_4=5&lv_5=1&lv_6=1&lv_7=0&lv_8=0&lv_9=0&lv_10=1', '');
INSERT INTO `ugame` VALUES ('60', '138', '9910', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=6&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('61', '173', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('62', '156', '8930', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=0&lv_3=1&lv_4=4&lv_5=1&lv_6=0&lv_7=0&lv_8=0&lv_9=0&lv_10=1', '');
INSERT INTO `ugame` VALUES ('63', '1910', '8600', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=2&lv_3=0&lv_4=0&lv_5=2&lv_6=1&lv_7=0&lv_8=0&lv_9=0&lv_10=1', 'user_ball_level=5');
INSERT INTO `ugame` VALUES ('64', '1907', '10300', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('65', '1911', '10300', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=0&lv_2=1&lv_3=4&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('66', '1912', '9700', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('67', '1913', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('68', '1899', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=0&lv_3=4&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=0', '');
INSERT INTO `ugame` VALUES ('69', '1914', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('70', '1915', '9800', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=0&lv_3=4&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('71', '1916', '10600', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=0&lv_2=1&lv_3=1&lv_4=1&lv_5=1&lv_6=0&lv_7=0&lv_8=0&lv_9=0&lv_10=1', '');
INSERT INTO `ugame` VALUES ('72', '1902', '10130', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=4&lv_3=8&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('73', '1917', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('74', '1918', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('75', '1919', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('76', '1908', '9900', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('78', '1901', '9720', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=9&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', 'user_ball_level=4');
INSERT INTO `ugame` VALUES ('79', '1920', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('80', '1921', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('81', '1922', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('82', '1923', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('83', '1924', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('84', '1925', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=0&lv_5=4&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('85', '1926', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('86', '1927', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('87', '1928', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('88', '1904', '10200', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=0&lv_2=1&lv_3=1&lv_4=1&lv_5=1&lv_6=0&lv_7=0&lv_8=0&lv_9=0&lv_10=1', '');
INSERT INTO `ugame` VALUES ('89', '1929', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('90', '1906', '9900', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('91', '1930', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
INSERT INTO `ugame` VALUES ('92', '1931', '10000', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'lv_1=3&lv_2=3&lv_3=3&lv_4=3&lv_5=3&lv_6=2&lv_7=2&lv_8=2&lv_9=2', '');
