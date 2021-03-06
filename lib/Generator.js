

const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const  downloadGitRepo   = require('download-git-repo')
const path = require('path')
const chalk = require('chalk')

const {
  getRepoList,
  getTagList
} = require('./http')


async function wrapLoading(fn, message, ...args) {

  const spinner = ora(message);

  spinner.start()

  try {
    const result = await fn(...args)
    spinner.succeed()
    return result
  } catch {

    spinner.fail('Request failed, refetch ...')
  
  }



}

class Generator {

  constructor(name, targetDir) {
    this.name = name

    this.targetDir = targetDir
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  async getRepo() {
    // 1）从远程拉取模板数据
    const repoList = await wrapLoading(getRepoList, 'waiting fetch template');
    if (!repoList) return;

    // 过滤我们需要的模板名称
    const repos = repoList.map(item => item.name);

    // 2）用户选择自己新下载的模板名称
    const {
      repo
    } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'Please choose a template to create project'
    })

    // 3）return 用户选择的名称
    return repo;
  }
  // 获取用户选择的版本
  // 1）基于 repo 结果，远程拉取对应的 tag 列表
  // 2）用户选择自己需要下载的 tag
  // 3）return 用户选择的 tag

  async getTag(repo) {
    // 1）基于 repo 结果，远程拉取对应的 tag 列表
    const tags = await wrapLoading(getTagList, 'waiting fetch tag', repo);
    if (!tags) return;

    // 过滤我们需要的 tag 名称
    const tagsList = tags.map(item => item.name);

    // 2）用户选择自己需要下载的 tag
    const {
      tag
    } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagsList,
      message: 'Place choose a tag to create project'
    })

    // 3）return 用户选择的 tag
    return tag
  }

  //下载远程模板
  //1拼接下载地址
  //2调用下载方法
  async download (repo,tag){
    
    //1>拼接url 
    const requestUrl = `zhurong-cli/${repo}${tag?'#'+tag:''}`;
    //2.下载
    await wrapLoading(
      this.downloadGitRepo, 
      'waiting download template',
      requestUrl,path.resolve(process.cwd(),this.targetDir)
      )

  } 



  // 核心创建逻辑
  // 1）获取模板名称
  // 2）获取 tag 名称
  // 3）下载模板到模板目录
  async create() {

    // 1）获取模板名称
    const repo = await this.getRepo()
    // 2) 获取 tag 名称
    const tag = await this.getTag(repo)
    console.log('用户选择了，repo=' + repo + '，tag=' + tag)
     // 3）下载模板到模板目录
    await this.download(repo,tag)

    // 4）模板使用提示
    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
    console.log('  npm install\r\n')
    console.log('  npm run serve\r\n')

  }





}
module.exports = Generator;