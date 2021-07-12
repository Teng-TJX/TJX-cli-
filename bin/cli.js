#! /usr/bin/env node

const program = require('commander')
const figlet = require('figlet')
const chalk = require('chalk')

program
  .command('create <app-name>')
  .description('create a new project')
  .option('-f ,--force','overwrite target directory if it exist')
  .action((name,options)=>{
    console.log('name:',name,'options:',options)
    require('../lib/create.js')(name,options)
  })

// 配置
program
  .command('config [value]')
  .description('inspect and modify the config') 
  .option('-g, --get <path>', 'get value from option')
  .option('-s, --set <path> <value>')
  .option('-d, --delete <path>', 'delete option from config')
  .action((value, options) => {
    console.log(value, options)
  })
//配置 ui 命令
program
  .command('ui')
  .description('start add open roc-cli ui')
  .option('-p,--port<port>','Port used for the UI Server')
  .action((value, options) => {
    console.log(value, options)
  })
program
  .version(`v${require('../package.json').version}`)
  .usage('<command> [option]')



program.on('--help',()=>{
  console.log('\r\n'+figlet.textSync('666 666 666',{
    font:'Ghost',
    horizontalLayout:"default",
    verticalLayout:'default',
    width:160,
    whitespaceBreak:true
  }))

    // 新增说明信息
    console.log(`\r\nRun ${chalk.cyan(`teng <command> --help`)} for detailed usage of given command\r\n`)
})
// 解析用户执行命令传入参数
program.parse(process.argv);