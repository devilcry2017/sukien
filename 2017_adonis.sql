-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th9 11, 2017 lúc 03:51 CH
-- Phiên bản máy phục vụ: 10.1.21-MariaDB
-- Phiên bản PHP: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `2017_adonis`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `colors`
--

CREATE TABLE `colors` (
  `id` int(11) NOT NULL,
  `language_code` varchar(10) NOT NULL,
  `status` int(11) NOT NULL,
  `arrange` int(11) NOT NULL,
  `color_name` varchar(255) NOT NULL,
  `color_code` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `colors`
--

INSERT INTO `colors` (`id`, `language_code`, `status`, `arrange`, `color_name`, `color_code`) VALUES
(1, 'vi', 1, 0, 'Đỏ', '#ff0000'),
(2, 'vi', 1, 0, 'Xanh da trời', '#0000ff'),
(3, 'vi', 1, 0, 'Xanh lá cây', '#00ff00'),
(4, 'vi', 1, 0, 'Tím', '#660066'),
(5, 'vi', 1, 0, 'Xanh ngọc lục', '#99FFFF'),
(6, 'en', 1, 0, 'Red', '#ff0000'),
(7, 'en', 1, 0, 'Blue', '#0000ff'),
(8, 'en', 1, 0, 'Green', '#00ff00'),
(9, 'en', 1, 0, 'Violet', '#660066'),
(9998, 'vi', 1, 0, 'Khác', '#######'),
(9999, 'en', 1, 0, 'Other', '#######');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `currencys`
--

CREATE TABLE `currencys` (
  `id` int(11) NOT NULL,
  `currency_default` int(1) NOT NULL DEFAULT '1',
  `status` int(1) NOT NULL DEFAULT '1',
  `currency_code` varchar(10) NOT NULL,
  `currency_name` varchar(100) NOT NULL,
  `currency_value` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `currencys`
--

INSERT INTO `currencys` (`id`, `currency_default`, `status`, `currency_code`, `currency_name`, `currency_value`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'VND', 'Việt Nam Đồng', 1, '2017-07-20 12:51:52', '2017-07-20 12:51:52'),
(2, 0, 1, 'USD', 'US dollars', 0.000044719424622253717, '2017-07-20 12:51:52', '2017-07-20 12:51:52');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `language`
--

CREATE TABLE `language` (
  `id` int(11) NOT NULL,
  `country` varchar(100) NOT NULL,
  `language_code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `default` int(11) NOT NULL,
  `arrange` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `language`
--

INSERT INTO `language` (`id`, `country`, `language_code`, `name`, `image`, `status`, `default`, `arrange`) VALUES
(1, 'Việt Nam', 'vi', 'Tiếng Việt', 'vi_flag.png', 1, 1, 0),
(2, 'England', 'en', 'English', 'en_flag.png', 1, 0, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `login_historys`
--

CREATE TABLE `login_historys` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `ip_address` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `login_historys`
--

INSERT INTO `login_historys` (`id`, `user_id`, `username`, `ip_address`, `created_at`, `updated_at`) VALUES
(1, 1, 'developer', '127.0.0.0', '2017-07-19 13:53:35', '0000-00-00 00:00:00'),
(2, 1, 'developer', '127.0.0.0', '2017-07-19 13:53:35', '0000-00-00 00:00:00'),
(3, 1, 'developer', '127.0.0.0', '2017-07-19 13:53:35', '0000-00-00 00:00:00'),
(4, 1, 'developer', '127.0.0.0', '2017-07-19 13:53:35', '0000-00-00 00:00:00'),
(5, 1, 'developer', '127.0.0.0', '2017-07-19 13:53:35', '0000-00-00 00:00:00'),
(6, 1, 'developer', '127.0.0.0', '2017-07-19 13:53:35', '0000-00-00 00:00:00'),
(7, 1, 'developer', '127.0.0.0', '2017-07-19 13:53:35', '0000-00-00 00:00:00'),
(8, 1, 'developer', '127.0.0.0', '2017-07-19 13:53:35', '0000-00-00 00:00:00'),
(9, 1, 'developer', '127.0.0.2', '2017-07-20 12:34:32', '0000-00-00 00:00:00'),
(10, 1, 'developer', '127.1.1.0', '2017-07-20 12:34:28', '0000-00-00 00:00:00'),
(11, 1, 'developer', '127.1.1.0', '2017-07-20 12:34:28', '0000-00-00 00:00:00'),
(12, 1, 'developer', '127.1.1.0', '2017-07-20 12:34:28', '0000-00-00 00:00:00'),
(13, 1, 'developer', '127.1.1.0', '2017-07-20 12:34:28', '0000-00-00 00:00:00'),
(14, 1, 'developer', '127.1.1.0', '2017-07-20 12:34:28', '0000-00-00 00:00:00'),
(15, 1, 'developer', '127.1.1.0', '2017-07-20 12:34:28', '0000-00-00 00:00:00'),
(16, 1, 'developer', '127.1.1.0', '2017-07-20 12:34:28', '0000-00-00 00:00:00'),
(17, 1, 'developer', '127.1.1.0', '2017-07-20 12:34:28', '0000-00-00 00:00:00'),
(18, 1, 'developer', '127.1.1.0', '2017-07-20 12:34:28', '0000-00-00 00:00:00'),
(19, 1, 'developer', '127.1.1.0', '2017-07-20 12:34:28', '0000-00-00 00:00:00'),
(20, 1, 'developer', '127.1.1.0', '2017-07-20 12:34:28', '0000-00-00 00:00:00'),
(21, 1, 'developer', '127.1.1.0', '2017-07-20 12:34:28', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `made_ins`
--

CREATE TABLE `made_ins` (
  `id` int(11) NOT NULL,
  `language_code` varchar(10) NOT NULL,
  `status` int(11) NOT NULL,
  `arrange` int(11) NOT NULL,
  `made_in_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `made_ins`
--

INSERT INTO `made_ins` (`id`, `language_code`, `status`, `arrange`, `made_in_name`) VALUES
(1, 'vi', 1, 1, 'Việt Nam'),
(2, 'vi', 1, 1, 'Anh'),
(3, 'vi', 1, 1, 'Mỹ'),
(4, 'en', 1, 1, 'Viet Nam'),
(5, 'en', 1, 1, 'English'),
(6, 'en', 1, 1, 'US');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `cat_id` int(11) NOT NULL,
  `language_code` varchar(10) NOT NULL,
  `status` int(11) NOT NULL,
  `arrange` int(11) NOT NULL,
  `views` int(11) NOT NULL,
  `hightlights` int(11) NOT NULL,
  `news_name` varchar(255) NOT NULL,
  `news_image` varchar(255) NOT NULL,
  `small_description` varchar(1000) NOT NULL,
  `description` text NOT NULL,
  `meta_title` varchar(1000) NOT NULL,
  `meta_description` varchar(1000) NOT NULL,
  `meta_keyword` varchar(1000) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `news`
--

INSERT INTO `news` (`id`, `cat_id`, `language_code`, `status`, `arrange`, `views`, `hightlights`, `news_name`, `news_image`, `small_description`, `description`, `meta_title`, `meta_description`, `meta_keyword`, `created_at`, `updated_at`) VALUES
(1, 1, 'vi', 1, 1, 1, 1, 'Tin khuyến mãi 1', '', '1', '1', '1', '1', '1', '2017-07-29 06:21:08', '0000-00-00 00:00:00'),
(2, 1, 'vi', 1, 1, 1, 1, 'Tin khuyến mãi 2', '', '1', '1', '1', '1', '1', '2017-07-29 06:21:19', '0000-00-00 00:00:00'),
(3, 1, 'vi', 1, 1, 1, 1, 'Khuyến mãi giảm abc', '', '1', '1', '1', '1', '1', '2017-07-29 06:21:19', '0000-00-00 00:00:00'),
(6, 2, 'vi', 1, 5, 3, 4, 'Ten tin tuc 22222', 'anh-tin-tucssss.png', 'ssdasdxsss', 'ádasdasdsssssss', 'ádssss', 'ádadsssssss', 'âsdasdssssss', '2017-07-31 13:16:31', '2017-07-31 13:16:31');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `news_categorys`
--

CREATE TABLE `news_categorys` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `language_code` varchar(10) NOT NULL,
  `status` int(1) NOT NULL DEFAULT '1',
  `arrange` int(11) NOT NULL,
  `views` int(11) NOT NULL,
  `hightlights` int(11) NOT NULL,
  `cat_name` varchar(255) NOT NULL,
  `small_description` varchar(1000) NOT NULL,
  `description` text NOT NULL,
  `meta_title` varchar(1000) NOT NULL,
  `meta_description` varchar(1000) NOT NULL,
  `meta_keyword` varchar(1000) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `news_categorys`
--

INSERT INTO `news_categorys` (`id`, `parent_id`, `language_code`, `status`, `arrange`, `views`, `hightlights`, `cat_name`, `small_description`, `description`, `meta_title`, `meta_description`, `meta_keyword`, `created_at`, `updated_at`) VALUES
(1, 0, 'vi', 1, 0, 0, 0, 'Tin khuyến mãi', '', '', '', '', '', '2017-07-26 13:38:03', '0000-00-00 00:00:00'),
(2, 0, 'vi', 1, 7, 5, 6, 'Tin công ty', 'Tin tức công ty', 'Tin tức công ty', 'Tin tức công ty', 'Tin tức công ty', 'Tin tức công ty', '2017-07-28 15:57:27', '2017-07-28 15:57:27'),
(3, 1, 'vi', 1, 0, 0, 0, 'Khuyến mãi tháng 8', '', '', '', '', '', '2017-07-26 13:38:09', '0000-00-00 00:00:00'),
(4, 1, 'vi', 1, 9, 4, 5, 'Khuyến mãi tháng 9', 'Gioi thieu ngan ve danh muc', 'des....', 'mt......', 'md.......', 'mk.......', '2017-07-28 15:46:26', '2017-07-28 15:46:26'),
(5, 3, 'vi', 1, 1, 0, 0, 'Ưu đãi tháng 8', '', '', '', '', '', '2017-07-26 15:46:18', '0000-00-00 00:00:00'),
(6, 3, 'vi', 1, 0, 0, 0, 'Trả góp tháng 8', '', '', '', '', '', '2017-07-26 13:40:20', '0000-00-00 00:00:00'),
(7, 2, 'vi', 1, 0, 0, 0, 'Thông báo', '', '', '', '', '', '2017-07-26 13:40:25', '0000-00-00 00:00:00'),
(8, 2, 'vi', 1, 0, 0, 0, 'Tiền lương', '', '', '', '', '', '2017-07-26 13:40:28', '0000-00-00 00:00:00'),
(10, 0, 'en', 1, 3, 1, 2, 'News sale', 'sssssss', 'sssssssssssssss', 'ssssssssssss', 'ssssssssssssss', 'sssssssssssss', '2017-07-28 16:02:36', '2017-07-28 16:02:36');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `cat_id` int(11) NOT NULL,
  `language_code` varchar(10) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `arrange` int(11) NOT NULL,
  `views` int(11) NOT NULL,
  `hightlights` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_image` varchar(255) NOT NULL,
  `small_description` varchar(1000) NOT NULL,
  `description` text NOT NULL,
  `meta_title` varchar(1000) NOT NULL,
  `meta_description` varchar(1000) NOT NULL,
  `meta_keyword` varchar(1000) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `cat_id`, `language_code`, `status`, `arrange`, `views`, `hightlights`, `product_name`, `product_image`, `small_description`, `description`, `meta_title`, `meta_description`, `meta_keyword`, `created_at`, `updated_at`) VALUES
(1, 1, 'vi', 1, 1, 1, 1, 'Sản phẩm 1', '', '', '1', '1', '1', '1', '2017-07-31 15:05:34', '0000-00-00 00:00:00'),
(2, 1, 'vi', 1, 1, 1, 1, 'Sản phẩm 2', '', 'ssssssssssssss', '1', '1', '1', '1', '2017-07-31 15:05:45', '2017-07-31 15:05:45'),
(3, 1, 'vi', 1, 4, 2, 3, 'Test sản phẩm', 'san-phamssss.png', 'nnnnn', 'mmmmm', 'mt', 'md', 'mk', '2017-07-31 15:23:03', '2017-07-31 15:23:03');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products_categorys`
--

CREATE TABLE `products_categorys` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `language_code` varchar(10) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `arrange` int(11) NOT NULL,
  `views` int(11) NOT NULL,
  `hightlights` int(11) NOT NULL,
  `cat_name` varchar(255) NOT NULL,
  `small_description` varchar(1000) NOT NULL,
  `description` text NOT NULL,
  `meta_title` varchar(1000) NOT NULL,
  `meta_description` varchar(1000) NOT NULL,
  `meta_keyword` varchar(1000) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `products_categorys`
--

INSERT INTO `products_categorys` (`id`, `parent_id`, `language_code`, `status`, `arrange`, `views`, `hightlights`, `cat_name`, `small_description`, `description`, `meta_title`, `meta_description`, `meta_keyword`, `created_at`, `updated_at`) VALUES
(1, 0, 'vi', 1, 1, 1, 1, 'Thời trang', '1', '1', '1', '1', '1', '2017-07-31 13:35:22', '0000-00-00 00:00:00'),
(2, 0, 'vi', 1, 1, 1, 1, 'Điện tử', '1', '1', '1', '1', '1', '2017-07-31 13:35:22', '0000-00-00 00:00:00'),
(3, 0, 'vi', 1, 1, 1, 1, 'Giày dép', '1', '1', '1', '1', '1', '2017-07-31 13:35:22', '0000-00-00 00:00:00'),
(4, 0, 'vi', 1, 1, 1, 1, 'Đồ lưu niệm', '1', '1', '1', '1', '1', '2017-07-31 13:35:22', '0000-00-00 00:00:00'),
(6, 3, 'vi', 1, 1, 1, 1, 'Giày dép nam', '1', '1', '1', '1', '1', '2017-07-31 14:06:12', '0000-00-00 00:00:00'),
(7, 3, 'vi', 1, 1, 1, 1, 'Giày dép nữ', '1', '1', '1', '1', '1', '2017-07-31 14:06:12', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sizes`
--

CREATE TABLE `sizes` (
  `id` int(11) NOT NULL,
  `language_code` varchar(10) NOT NULL,
  `status` int(11) NOT NULL,
  `arrange` int(11) NOT NULL,
  `size_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `sizes`
--

INSERT INTO `sizes` (`id`, `language_code`, `status`, `arrange`, `size_name`) VALUES
(1, 'vi', 1, 1, 'M'),
(2, 'vi', 1, 3, 'L'),
(3, 'vi', 1, 2, 'S'),
(4, 'vi', 1, 999, 'Khác'),
(5, 'en', 1, 1, 'M'),
(6, 'en', 1, 3, 'L'),
(7, 'en', 1, 2, 'S'),
(8, 'en', 1, 999, 'Other');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `systems`
--

CREATE TABLE `systems` (
  `id` int(11) NOT NULL,
  `language_code` varchar(10) NOT NULL,
  `systems_key` varchar(100) NOT NULL,
  `systems_description` varchar(1000) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `systems`
--

INSERT INTO `systems` (`id`, `language_code`, `systems_key`, `systems_description`, `created_at`, `updated_at`) VALUES
(1, 'vi', 'systems_website', 'http://www.tiki.vn', '2017-07-16 06:40:15', '2017-07-16 06:40:15'),
(2, 'vi', 'systems_google_analytic', 'google analytics here', '2017-07-20 12:51:51', '2017-07-20 12:51:51'),
(3, 'vi', 'systems_google_map', 'google map here', '2017-07-20 12:51:51', '2017-07-20 12:51:51'),
(4, 'vi', 'systems_company_name', 'Công ty cổ phần TIKI', '2017-07-16 06:40:15', '2017-07-16 06:40:15'),
(5, 'en', 'systems_company_name', 'Tiki company', '2017-07-16 06:40:16', '2017-07-16 06:40:16'),
(6, 'vi', 'systems_company_address', 'tp hcm', '2017-07-14 15:53:12', '2017-07-14 15:53:12'),
(7, 'en', 'systems_company_address', 'binh thuan city', '2017-07-14 15:53:12', '2017-07-14 15:53:12'),
(8, 'vi', 'systems_company_email', 'tiki@gmail.com', '2017-07-14 15:53:12', '2017-07-14 15:53:12'),
(9, 'en', 'systems_company_email', 'tiki@gmail.com', '2017-07-14 15:53:12', '2017-07-14 15:53:12'),
(10, 'vi', 'systems_company_phone', '08334445', '2017-07-14 15:53:12', '2017-07-14 15:53:12'),
(11, 'en', 'systems_company_phone', '+84 223123123 ', '2017-07-14 15:53:12', '2017-07-14 15:53:12'),
(12, 'vi', 'systems_company_hotline', '099333222', '2017-07-14 15:53:12', '2017-07-14 15:53:12'),
(13, 'en', 'systems_company_hotline', '+849123123213', '2017-07-14 15:53:12', '2017-07-14 15:53:12'),
(14, 'vi', 'systems_company_taxcode', '0909909', '2017-07-14 15:53:12', '2017-07-14 15:53:12'),
(15, 'en', 'systems_company_taxcode', '123123213', '2017-07-14 15:53:12', '2017-07-14 15:53:12'),
(16, 'vi', 'systems_copyright', 'Tiki All receved.', '2017-07-14 15:53:13', '2017-07-14 15:53:13'),
(17, 'en', 'systems_copyright', 'tiki all copyright', '2017-07-14 15:53:13', '2017-07-14 15:53:13'),
(18, 'vi', 'systems_logo', 'logo.jpg', '2017-07-17 14:06:31', '2017-07-17 14:06:31'),
(19, 'vi', 'systems_favicon', 'favicon.png', '2017-07-17 14:06:31', '2017-07-17 14:06:31');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `fullname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `level`, `username`, `password`, `email`, `fullname`) VALUES
(1, 1, 'developer', '$2a$10$AwJwCMvwOZgY1BdV4w06FOqRClf/Yr/xDaan3q/5R2BcM/hyu9qPe', 'quocbao.thietke.laptrinhweb@gmail.com', 'Nguyễn Bảo Quốc');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `weights`
--

CREATE TABLE `weights` (
  `id` int(11) NOT NULL,
  `language_code` varchar(10) NOT NULL,
  `status` int(11) NOT NULL,
  `arrange` int(11) NOT NULL,
  `weights_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `weights`
--

INSERT INTO `weights` (`id`, `language_code`, `status`, `arrange`, `weights_name`) VALUES
(1, 'vi', 1, 1, '1 ký'),
(2, 'vi', 1, 2, '2 ký'),
(3, 'vi', 1, 3, '3 ký'),
(4, 'vi', 1, 999, 'Khác'),
(5, 'en', 1, 1, '1 Kg'),
(6, 'en', 1, 2, '2 Kg'),
(7, 'en', 1, 3, '3 Kg'),
(8, 'en', 1, 999, 'Other');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `colors`
--
ALTER TABLE `colors`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `currencys`
--
ALTER TABLE `currencys`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `language`
--
ALTER TABLE `language`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `login_historys`
--
ALTER TABLE `login_historys`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `made_ins`
--
ALTER TABLE `made_ins`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `news_categorys`
--
ALTER TABLE `news_categorys`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `products_categorys`
--
ALTER TABLE `products_categorys`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `sizes`
--
ALTER TABLE `sizes`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `systems`
--
ALTER TABLE `systems`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `weights`
--
ALTER TABLE `weights`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `colors`
--
ALTER TABLE `colors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10000;
--
-- AUTO_INCREMENT cho bảng `currencys`
--
ALTER TABLE `currencys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT cho bảng `language`
--
ALTER TABLE `language`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT cho bảng `login_historys`
--
ALTER TABLE `login_historys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT cho bảng `made_ins`
--
ALTER TABLE `made_ins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT cho bảng `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT cho bảng `news_categorys`
--
ALTER TABLE `news_categorys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT cho bảng `products_categorys`
--
ALTER TABLE `products_categorys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT cho bảng `sizes`
--
ALTER TABLE `sizes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT cho bảng `systems`
--
ALTER TABLE `systems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT cho bảng `weights`
--
ALTER TABLE `weights`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
