/**
 *
 * 此处修改连接的后台地址
 * 注意测试或上线前，要修改production下的baseUrl再进行打包
 *
 */

let baseUrl = '';

if (process.env.NODE_ENV === 'development') { //本地开发环境

  baseUrl = 'http://localhost:3000/';

} else if (process.env.NODE_ENV === 'production') { //测试或线上环境

  baseUrl = 'http://';
}

export {
	baseUrl
}
