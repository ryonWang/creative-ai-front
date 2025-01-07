const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');
const { projectDir, hbuildxDir, appDir, appList } = require('./autoConfig');

async function switchBranch(item){
	try{
		const { branch } = item
		// 进入项目目录 & 执行切换分支命令
		await exec(`cd ${projectDir} && git checkout ${branch}`, { stdio:'inherit' });
		console.log(`切换到${branch}分支`)
		// 进入hbuildX目录 & 执行打包命令
		console.log(`--开始打包${branch}--`)
		const res = await exec(`cd ${hbuildxDir}/ &&cli pack --config ${projectDir}/configure.json`, { stdio:'inherit' });
		console.log(`--${branch}打包结束--`)
	}catch(e){
		throw e
	}
}

async function startBuild(branchArr){
	for(let branch of branchArr){
		await switchBranch(branch)
	}
	// 进入apk目录
	fs.readdir(appDir, (err, files) => {
		if (err) return console.error(`读取目录出错: ${err}`);
		for(let branch of branchArr){
			const { appName, appid } = branch
			const obj = files.find(file=> path.basename(file).includes(appid))
			if(obj){
				// 匹配到文件并进行重命名
				const fileName = path.basename(obj);
				try {
					fs.renameSync(`${appDir}/${fileName}`, `${appDir}/${appName}.apk`);
					console.log(`重命名成功 ${appName}.apk`);
				} catch (err) {
					console.error(`重命名文件出错: ${err}`);
				}
			}else{
				console.error(`重命名文件出错: 未找到对应appid:${appid}的文件`);
			}
		}
	});
}
startBuild(appList).catch(console.error);