'use strict';

const pkg = require('./package.json');
const gulp = require('gulp');

const uglifyEs = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const header = require('gulp-header');
const babel = require('gulp-babel');
const del = require('del');
const minimist = require('minimist');
const gulpHtmlmin = require('gulp-htmlmin');
const gzip = require('gulp-gzip');

// 文件版本
const fileVersion = new Date().getTime();


// 基础配置
const config = {
    //注释
    comment: [
`/**
    File: TL-RTC-APP-SDK-V<%= pkg.version %>
    Licensed: <%= pkg.license %>
    Repository: <%= pkg.repository.url %>
    Author: <%= pkg.author %>
    Build: <%= new Date().toLocaleString() %>
*/
`
        , { pkg: pkg, js: '' }
    ]
};

// 获取参数
const argv = minimist(process.argv.slice(2), {
    default: {
        version: pkg.version
    }
});

// 输出目录
const dest = ({
    dist: './dist'
}[argv.dest || 'dist'] || argv.dest) + (argv.vs ? '/' + pkg.version : '');


// lib-entry-sdk.min.js
const entry_js = () => {
    return gulp.src([
        './web-v2-res/js/tl_rtc_entry.js',
    ])
    .pipe(babel())
    .pipe(uglifyEs({
        mangle: true,
        compress: true,
        output: {
            ascii_only: true
        },
    }))
    .pipe(replace('  ', ''))
    .pipe(replace('\n', ''))
    .pipe(replace(
        'lib-basic-sdk.min.js', 'lib-basic-sdk.min.' + fileVersion + '.js'
    ))
    .pipe(replace(
        'lib-component-sdk.min.js', 'lib-component-sdk.min.' + fileVersion + '.js'
    ))
    .pipe(replace(
        'lib-module-sdk.min.js', 'lib-module-sdk.min.' + fileVersion + '.js'
    ))
    .pipe(concat('lib-entry-sdk.min.' + fileVersion + '.js', { newLine: ' ' }))
    .pipe(header.apply(null, config.comment))
    .pipe(gulp.dest(dest))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(dest));
};


// lib-basic-sdk.min.js
const basic_js = () => {
    return gulp.src([
        './web-v2-res/js/basic/*.js',
    ])
    .pipe(babel())
    .pipe(uglifyEs({
        mangle: true,
        compress: true,
        output: {
            ascii_only: true
        },
    }))
    .pipe(replace('  ', ''))
    .pipe(replace('\n', ''))
    .pipe(concat('lib-basic-sdk.min.' + fileVersion + '.js', { newLine: ';' }))
    .pipe(header.apply(null, config.comment))
    .pipe(gulp.dest(dest))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(dest));
};


// lib-component-sdk.min.js
const component_js = () => {
    return gulp.src([
        './web-v2-res/js/component/*.js',
    ])
    .pipe(babel())
    .pipe(uglifyEs({
        mangle: true,
        compress: true,
        output: {
            ascii_only: true
        },
    }))
    .pipe(replace('  ', ''))
    .pipe(replace('\n', ''))
    .pipe(concat('lib-component-sdk.min.' + fileVersion + '.js', { newLine: ' ' }))
    .pipe(header.apply(null, config.comment))
    .pipe(gulp.dest(dest))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(dest));
};

// lib-module-sdk.min.js
const module_js = () => {
    return gulp.src([
        // sidebar模块
        './web-v2-res/js/module/sidebar/logo.js',
        './web-v2-res/js/module/sidebar/tool.js',
        './web-v2-res/js/module/sidebar/bottom.js',
        './web-v2-res/js/module/sidebar/sidebar.js',

        // channel模块
        './web-v2-res/js/module/channel/top.js',
        './web-v2-res/js/module/channel/list.js',
        './web-v2-res/js/module/channel/channel.js',
        // channel-content模块
        './web-v2-res/js/module/channel/content/body.js',
        './web-v2-res/js/module/channel/content/more.js',
        './web-v2-res/js/module/channel/content/invite.js',
        './web-v2-res/js/module/channel/content/tool.js',
        './web-v2-res/js/module/channel/content/textarea.js',
        './web-v2-res/js/module/channel/content.js',

        // login模块
        './web-v2-res/js/module/login/mobile.js',
        './web-v2-res/js/module/login/list.js',
        './web-v2-res/js/module/login/login.js',
        // login-content模块
        './web-v2-res/js/module/login/content/mobile.js',
        './web-v2-res/js/module/login/content/account.js',
        './web-v2-res/js/module/login/content/email.js',
        './web-v2-res/js/module/login/content.js',

        // contact模块
        './web-v2-res/js/module/contact/list.js',
        './web-v2-res/js/module/contact/top.js',
        './web-v2-res/js/module/contact/contact.js',
        // contact-content模块
        './web-v2-res/js/module/contact/content/group.js',
        './web-v2-res/js/module/contact/content/apply.js',
        './web-v2-res/js/module/contact/content/friend.js',
        './web-v2-res/js/module/contact/content/search.js',
        './web-v2-res/js/module/contact/content.js',

        //setting模块
        './web-v2-res/js/module/setting/list.js',
        './web-v2-res/js/module/setting/setting.js',
        //setting-content模块
        './web-v2-res/js/module/setting/content/account.js',
        './web-v2-res/js/module/setting/content/other.js',
        './web-v2-res/js/module/setting/content.js',

        //blank模块
        './web-v2-res/js/module/blank/content.js',

        //主模块
        './web-v2-res/js/tl_rtc_app.js',
    ])
    .pipe(babel())
    .pipe(uglifyEs({
        mangle: true,
        compress: true,
        output: {
            ascii_only: true
        },
    }))
    .pipe(replace('  ', ''))
    .pipe(replace('\n', ''))
    .pipe(concat('lib-module-sdk.min.' + fileVersion + '.js', { newLine: ' ' }))
    .pipe(header.apply(null, config.comment))
    .pipe(gulp.dest(dest))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(dest));
};


// js
const js = gulp.parallel(
    basic_js, entry_js, component_js, module_js
);

// css
const css = () => {
    return gulp.src([
        './web-v2-res/css/comm.css',
        './web-v2-res/css/pc.css',
        './web-v2-res/css/ipad.css',
        './web-v2-res/css/mobile.css',
        './web-v2-res/css/max.css',
        './web-v2-res/css/max-mobile.css',
    ])
    .pipe(cleanCSS())
    .pipe(concat('lib-css-sdk.min.' + fileVersion + '.css', { newLine: '\n' }))
    .pipe(header.apply(null, config.comment))
    .pipe(gulp.dest(dest))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(dest));
};


// html
const html = () => {
    return gulp.src([
        './web-v2-res/*.{html,json}',
    ])
    .pipe(replace(
        'lib-entry-sdk.min.js', 'lib-entry-sdk.min.' + fileVersion + '.js'
    ))
    .pipe(replace(
        'lib-basic-sdk.min.js', 'lib-basic-sdk.min.' + fileVersion + '.js'
    ))
    .pipe(replace(
        'lib-component-sdk.min.js', 'lib-component-sdk.min.' + fileVersion + '.js'
    ))
    .pipe(replace(
        'lib-module-sdk.min.js', 'lib-module-sdk.min.' + fileVersion + '.js'
    ))
    .pipe(replace(
        'lib-css-sdk.min.css', 'lib-css-sdk.min.' + fileVersion + '.css'
    ))
    .pipe(gulpHtmlmin({
        collapseWhitespace: true,
        removeComments: true,
    }))
    .pipe(gulp.dest(dest))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(dest));
};

// image
const image = () => {
    return gulp.src([
        './web-v2-res/image/*.{eot,svg,ttf,woff,woff2,png,jpg,gif,jpeg,mp3}',
        './web-v2-res/image/example/*.{eot,svg,ttf,woff,woff2,png,jpg,gif,jpeg,mp3}',
    ])
    .pipe(gulp.dest(dest + '/image'))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(dest + '/image'));
};

// statics
const statics = () => {
    return gulp.src([
        './web-v2-res/static/**/*.*',
    ])
    .pipe(gulp.dest(dest + '/static'))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(dest + '/static'));
};

// clean
const clean = cb => {
    return del([dest], {
        force: true
    });
};

const defaultTask = gulp.series(clean, gulp.parallel(
    basic_js, entry_js, component_js, module_js, css, html, image, statics
));


// task
exports.default = gulp.series(clean, gulp.parallel(
    js, css, html, image, statics
));

exports.watch = () => {
    gulp.watch('./web-v2-res/js/**', defaultTask);
    gulp.watch('./web-v2-res/css/**', defaultTask);
    gulp.watch('./web-v2-res/image/**', defaultTask);
    gulp.watch('./web-v2-res/static/**', defaultTask);
    gulp.watch('./web-v2-res/*.{eot,svg,ttf,woff,woff2,html,json,png,jpg,gif,jpeg,mp3}', defaultTask);
};