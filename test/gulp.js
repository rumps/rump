import 'babel/register-without-polyfill'
import 'should-sinon'
import test from 'ava'
import gulp from 'gulp'
import timeout from 'timeout-then'
import configs from '../src/configs'
import rump from '../src'
import {exists, mkdir} from 'mz/fs'
import {join} from 'path'
import {spy} from 'sinon'
import {stripColor} from 'chalk'

const tmpDir = 'tmp'

test.beforeEach(() => {
  process.chdir(join(__dirname, '..'))
  rump.configure({clean: true, paths: {destination: {root: tmpDir}}})
  configs.watch = false
})

test('added and defined', () => {
  const callback = spy()
  rump.on('gulp:main', callback)
  rump.addGulpTasks({prefix: 'spec'})
  callback.should.be.calledOnce()
  gulp.tasks['spec:build'].should.be.ok()
  gulp.tasks['spec:build:prod'].should.be.ok()
  gulp.tasks['spec:clean'].should.be.ok()
  gulp.tasks['spec:clean:safe'].should.be.ok()
  gulp.tasks['spec:prod:setup'].should.be.ok()
  gulp.tasks['spec:info'].should.be.ok()
  gulp.tasks['spec:info:core'].should.be.ok()
  gulp.tasks['spec:info:prod'].should.be.ok()
  gulp.tasks['spec:lint'].should.be.ok()
  gulp.tasks['spec:lint:watch'].should.be.ok()
  gulp.tasks['spec:test'].should.be.ok()
  gulp.tasks['spec:test:watch'].should.be.ok()
  gulp.tasks['spec:watch'].should.be.ok()
  gulp.tasks['spec:watch:setup'].should.be.ok()
  gulp.tasks['spec:watch:prod'].should.be.ok()
})

test('display information in info task', () => {
  const logs = []
  const {log} = console
  console.log = newLog
  gulp.start('spec:info')
  console.log = log
  logs.should.eql([
    '',
    '--- Core v0.8.3',
    'Environment is development',
    `${tmpDir} will be cleaned`,
    '',
  ])
  logs.length = 0
  console.log = newLog
  rump.reconfigure({clean: false})
  gulp.start('spec:info')
  console.log = log
  logs.should.eql([
    '',
    '--- Core v0.8.3',
    'Environment is development',
    '',
  ])
  logs.length = 0
  console.log = newLog
  gulp.start('spec:info:prod')
  console.log = log
  logs.should.eql([
    '',
    '--- Core v0.8.3',
    'Environment is production',
    '',
  ])

  function newLog(...args) {
    logs.push(stripColor(args.join(' ')))
  }
})

test('handle watch', () => {
  configs.watch.should.be.false()
  rump.configs.watch.should.be.false()
  gulp.start('spec:watch:setup')
  configs.watch.should.be.true()
  rump.configs.watch.should.be.true()
})

test('clean build directory', async() => {
  let tmpExists
  if(!await exists('tmp')) {
    await mkdir('tmp')
  }

  tmpExists = await exists(tmpDir)
  tmpExists.should.be.true()
  gulp.start('spec:clean:safe')
  await timeout(1000)
  tmpExists = await exists(tmpDir)
  tmpExists.should.be.false()

  await mkdir('tmp')
  rump.reconfigure({clean: false})
  gulp.start('spec:clean:safe')
  await timeout(1000)
  tmpExists = await exists(tmpDir)
  tmpExists.should.be.true()

  gulp.start('spec:clean')
  await timeout(1000)
  tmpExists = await exists(tmpDir)
  tmpExists.should.be.false()
})

test('handle production', () => {
  rump.configs.main.environment.should.equal('development')
  gulp.start('spec:prod:setup')
  rump.configs.main.environment.should.equal('production')
})
