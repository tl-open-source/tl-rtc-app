const fs = require('fs');
const path = require('path');
const {
	tlConsoleError
} = require("../../src/utils/utils");

module.exports = () => {
	let allRouterMap = {};

	whiteDir = []
	whiteFile = ['router.js']
	let allApps = fs.readdirSync(__dirname);
	for (let client of allApps) {
		//过滤文件夹和文件
		if (whiteDir.includes(client) || whiteFile.includes(client)) continue;
		try {
			//添加router
			let stat = fs.statSync(path.join(__dirname, client, client + '.js'));
			if (stat && stat.isFile()) {
				const subModuleRouterMap = require("./" + client + '/' + client);
				for(let subModule in subModuleRouterMap){
					const subModuleRouter = subModuleRouterMap[subModule];
					allRouterMap["/api/" + client + "/" + subModule] = subModuleRouter
				}
			}
		} catch (e) {
			tlConsoleError(e)
		}
	}
	return allRouterMap;
}