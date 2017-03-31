import gulp from 'gulp'
import concat from 'gulp-concat'
import rename from 'gulp-rename'
import gutil from 'gulp-util'
import through from 'through2'
import config from './src/config'
import web3 from './src/web3client'
import { compile, deploy } from './src/gulp-eth'
import { coinbase } from './src/keys'

var paths = {
  src: [
  'src/contracts/**/_*.sol',
  'src/contracts/**/*.sol'
  ],
  build: 'build'
}

gulp.task('concat', function(){
  return gulp.src(paths.src)
  .pipe(concat('contracts.concat.sol'))
  .pipe(gulp.dest(paths.build))
  .on('error', gutil.log)
})

gulp.task('compile', [ 'concat' ], function() {
  console.log('Using Geth @ \'' + config.gethUrl + '\'')
  return gulp.src(paths.build + '/*.sol')
  .pipe(compile())
  .pipe(rename(function (path) {
    path.basename = path.basename.replace('.concat', '.compiled')
    path.extname = ".json"
  }))
  .pipe(gulp.dest(paths.build))
  .on('error', gutil.log)
})

gulp.task('deploy', [ 'compile' ], async function () {
  const binaries = require(`./${paths.build}/contracts.compiled.json`)
  console.log(`Iterations: ${config.deployIterations}`)
  for (var i = 1; i <= config.deployIterations; i++) {
    const contract = await deploy(web3, coinbase.address, 'SimpleStorage', binaries.contracts[':SimpleStorage'], i)
    var storedData = contract.get.call();
    console.log(`- Stored Data: ${storedData}`)
  }
})

gulp.task('default', ['concat', 'compile'])
