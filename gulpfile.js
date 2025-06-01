'use strict';

const {
    replaceVarsMap
} = require('./gulp-obfuscator');
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
const web_dest = ({
    dist: './web-dist'
}[argv.dest || 'dist'] || argv.dest) + (argv.vs ? '/' + pkg.version : '');

const system_dest = ({
    dist: './system-dist'
}[argv.dist || 'dist'] || argv.dist) + (argv.vs ? '/' + pkg.version : '');


// lib-entry-sdk.min.js
const web_entry_js = () => {
    return gulp.src([
        './web-res/js/tl_rtc_entry.js',
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
        new RegExp(Object.keys(replaceVarsMap).join('|'), 'g'),
        function(matched) {
            return replaceVarsMap[matched];
        }
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
    .pipe(concat('lib-entry-sdk.min.' + fileVersion + '.js', { newLine: ' ' }))
    .pipe(header.apply(null, config.comment))
    .pipe(gulp.dest(web_dest))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(web_dest));
};

// lib-basic-sdk.min.js
const web_basic_js = () => {
    return gulp.src([
        './web-res/js/basic/*.js',
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
        new RegExp(Object.keys(replaceVarsMap).join('|'), 'g'),
        function(matched) {
            return replaceVarsMap[matched];
        }
    ))
    .pipe(concat('lib-basic-sdk.min.' + fileVersion + '.js', { newLine: ';' }))
    .pipe(header.apply(null, config.comment))
    .pipe(gulp.dest(web_dest))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(web_dest));
};

// lib-component-sdk.min.js
const web_component_js = () => {
    return gulp.src([
        './web-res/js/component/*.js',
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
        new RegExp(Object.keys(replaceVarsMap).join('|'), 'g'),
        function(matched) {
            return replaceVarsMap[matched];
        }
    ))
    .pipe(concat('lib-component-sdk.min.' + fileVersion + '.js', { newLine: ' ' }))
    .pipe(header.apply(null, config.comment))
    .pipe(gulp.dest(web_dest))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(web_dest));
};

// lib-module-sdk.min.js
const web_module_js = () => {
    return gulp.src([
        // sidebar模块
        './web-res/js/module/sidebar/hovertips.js',
        './web-res/js/module/sidebar/logo.js',
        './web-res/js/module/sidebar/tool.js',
        './web-res/js/module/sidebar/bottom.js',
        './web-res/js/module/sidebar/sidebar.js',

        // channel模块
        './web-res/js/module/channel/top.js',
        './web-res/js/module/channel/list.js',
        './web-res/js/module/channel/channel.js',
        // channel-content模块
        './web-res/js/module/channel/content/search.js',
        './web-res/js/module/channel/content/body.js',
        './web-res/js/module/channel/content/more.js',
        './web-res/js/module/channel/content/invite.js',
        './web-res/js/module/channel/content/tool.js',
        './web-res/js/module/channel/content/textarea.js',
        './web-res/js/module/channel/content.js',

        // login模块
        './web-res/js/module/login/mobile.js',
        './web-res/js/module/login/list.js',
        './web-res/js/module/login/login.js',
        // login-content模块
        './web-res/js/module/login/content/account.js',
        './web-res/js/module/login/content/email.js',
        './web-res/js/module/login/content.js',

        // contact模块
        './web-res/js/module/contact/list.js',
        './web-res/js/module/contact/top.js',
        './web-res/js/module/contact/contact.js',
        // contact-content模块
        './web-res/js/module/contact/content/group.js',
        './web-res/js/module/contact/content/apply_user.js',
        './web-res/js/module/contact/content/apply_group.js',
        './web-res/js/module/contact/content/friend.js',
        './web-res/js/module/contact/content/search_user.js',
        './web-res/js/module/contact/content/search_group.js',
        './web-res/js/module/contact/content.js',

        //setting模块
        './web-res/js/module/setting/list.js',
        './web-res/js/module/setting/setting.js',
        //setting-content模块
        './web-res/js/module/setting/content/normal.js',
        './web-res/js/module/setting/content/account.js',
        './web-res/js/module/setting/content/message.js',
        './web-res/js/module/setting/content/skin.js',
        './web-res/js/module/setting/content/other.js',
        './web-res/js/module/setting/content.js',

        //blank模块
        './web-res/js/module/blank/content.js',

        //主模块
        './web-res/js/tl_rtc_app.js',
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
        new RegExp(Object.keys(replaceVarsMap).join('|'), 'g'),
        function(matched) {
            return replaceVarsMap[matched];
        }
    ))
    .pipe(concat('lib-module-sdk.min.' + fileVersion + '.js', { newLine: ' ' }))
    .pipe(header.apply(null, config.comment))
    .pipe(gulp.dest(web_dest))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(web_dest));
};

// lib-css-sdk.min.css
const web_css = () => {
    return gulp.src([
        // 基础
        './web-res/css/pc.css',

        // 组件样式
        './web-res/css/*/*.css',

        // 媒体查询样式
        './web-res/css/max.css',
        './web-res/css/ipad.css',
        './web-res/css/max-mobile.css',
        './web-res/css/mobile.css',
    ])
    .pipe(cleanCSS())
    .pipe(replace(
        new RegExp(Object.keys(replaceVarsMap).join('|'), 'g'),
        function(matched) {
            return replaceVarsMap[matched];
        }
    ))
    .pipe(concat('lib-css-sdk.min.' + fileVersion + '.css', { newLine: '\n' }))
    .pipe(header.apply(null, config.comment))
    .pipe(gulp.dest(web_dest))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(web_dest));
};

// html
const web_html = () => {
    return gulp.src([
        './web-res/*.html',
    ])
    .pipe(replace(
        new RegExp(Object.keys(replaceVarsMap).join('|'), 'g'),
        function(matched) {
            return replaceVarsMap[matched];
        }
    ))
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
    .pipe(gulp.dest(web_dest))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(web_dest));
};

// image
const web_image = () => {
    return gulp.src([
        './web-res/image/*.{eot,svg,ttf,woff,woff2,png,jpg,gif,jpeg,mp3}',
    ])
    .pipe(gulp.dest(web_dest + '/image'))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(web_dest + '/image'))
};

// statics
const web_statics = () => {
    return gulp.src([
        './web-res/static/**/*.*',
    ])
    .pipe(replace(
        new RegExp(Object.keys(replaceVarsMap).join('|'), 'g'),
        function(matched) {
            return replaceVarsMap[matched];
        }
    ))
    .pipe(gulp.dest(web_dest + '/static'))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(web_dest + '/static'))
};


/**********************************************以上为产品端前端资源*************************************************/

// lib-css-sdk.min.css
const system_web_css = () => {
    return gulp.src([
        // 基础
        './web-res/css/pc.css',

        // 组件样式
        './web-res/css/*/*.css',

        // 媒体查询样式
        './web-res/css/max.css',
        './web-res/css/ipad.css',
        './web-res/css/max-mobile.css',
        './web-res/css/mobile.css',
    ])
    .pipe(cleanCSS())
    .pipe(replace(
        new RegExp(Object.keys(replaceVarsMap).join('|'), 'g'),
        function(matched) {
            return replaceVarsMap[matched];
        }
    ))
    .pipe(concat('lib-css-sdk.min.' + fileVersion + '.css', { newLine: '\n' }))
    .pipe(header.apply(null, config.comment))
    .pipe(gulp.dest(system_dest))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(system_dest));
};

// lib-basic-sdk.min.js
const system_web_basic_js = () => {
    return gulp.src([
        './web-res/js/basic/*.js',
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
        new RegExp(Object.keys(replaceVarsMap).join('|'), 'g'),
        function(matched) {
            return replaceVarsMap[matched];
        }
    ))
    .pipe(concat('lib-basic-sdk.min.' + fileVersion + '.js', { newLine: ';' }))
    .pipe(header.apply(null, config.comment))
    .pipe(gulp.dest(system_dest))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(system_dest));
};

// lib-component-sdk.min.js
const system_web_component_js = () => {
    return gulp.src([
        './web-res/js/component/*.js',
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
        new RegExp(Object.keys(replaceVarsMap).join('|'), 'g'),
        function(matched) {
            return replaceVarsMap[matched];
        }
    ))
    .pipe(concat('lib-component-sdk.min.' + fileVersion + '.js', { newLine: ' ' }))
    .pipe(header.apply(null, config.comment))
    .pipe(gulp.dest(system_dest))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(system_dest));
};

// lib-system-sdk.min.js
const system_js = () => {
    return gulp.src([
        './system-res/js/*.js',
        './system-res/js/component/*.js',
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
        new RegExp(Object.keys(replaceVarsMap).join('|'), 'g'),
        function(matched) {
            return replaceVarsMap[matched];
        }
    ))
    .pipe(replace(
        'lib-basic-sdk.min.js', 'lib-basic-sdk.min.' + fileVersion + '.js'
    ))
    .pipe(replace(
        'lib-component-sdk.min.js', 'lib-component-sdk.min.' + fileVersion + '.js'
    ))
    .pipe(concat('lib-system-sdk.min.' + fileVersion + ".js", { newLine: ';' }))
    .pipe(header.apply(null, config.comment))
    .pipe(gulp.dest(system_dest))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(system_dest));
};

// lib-system-sdk.min.css
const system_css = () => {
    return gulp.src([
        './system-res/css/*.css',
        './system-res/css/component/*.css',
    ])
    .pipe(cleanCSS())
    .pipe(replace(
        new RegExp(Object.keys(replaceVarsMap).join('|'), 'g'),
        function(matched) {
            return replaceVarsMap[matched];
        }
    ))
    .pipe(concat('lib-system-sdk.min.' + fileVersion + '.css', { newLine: '\n' }))
    .pipe(header.apply(null, config.comment))
    .pipe(gulp.dest(system_dest))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(system_dest));
};

// system html
const system_html = () => {
    return gulp.src([
        './system-res/system.html',
    ])
    .pipe(replace(
        new RegExp(Object.keys(replaceVarsMap).join('|'), 'g'),
        function(matched) {
            return replaceVarsMap[matched];
        }
    ))
    .pipe(replace(
        'lib-system-sdk.min.js', 'lib-system-sdk.min.' + fileVersion + '.js'
    ))
    .pipe(replace(
        'lib-system-sdk.min.css', 'lib-system-sdk.min.' + fileVersion + '.css'
    ))
    .pipe(replace(
        'lib-css-sdk.min.css', 'lib-css-sdk.min.' + fileVersion + '.css'
    ))
    .pipe(gulpHtmlmin({
        collapseWhitespace: true,
        removeComments: true,
    }))
    .pipe(gulp.dest(system_dest))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(system_dest));
};

// system image
const system_image = () => {
    return gulp.src([
        './system-res/image/*.{eot,svg,ttf,woff,woff2,png,jpg,gif,jpeg,mp3}',
    ])
    .pipe(gulp.dest(system_dest + '/image'))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(system_dest + '/image'))
};

// system statics
const system_statics = () => {
    return gulp.src([
        './system-res/static/**/*.*',
    ])
    .pipe(replace(
        new RegExp(Object.keys(replaceVarsMap).join('|'), 'g'),
        function(matched) {
            return replaceVarsMap[matched];
        }
    ))
    .pipe(gulp.dest(system_dest + '/static'))
    .pipe(gzip({
        append: true,
        gzipOptions: {
            level: 9,
            memLevel: 9
        }
    }))
    .pipe(gulp.dest(system_dest + '/static'))
};


/**********************************************以上为管理端前端资源*************************************************/
const cleanWeb = cb => {
    return del([web_dest], {
        force: true
    });
};

const cleanSystem = cb => {
    return del([system_dest], {
        force: true
    });
}


// 产品端
const webTask = gulp.series(cleanWeb, gulp.parallel(
    web_css, web_html, web_image, web_statics, 
    web_basic_js, web_component_js, web_entry_js, web_module_js,
));


// 管理端
const systemTask = gulp.series(cleanSystem, gulp.parallel(
    // 引入产品端资源
    system_web_css, system_web_basic_js, system_web_component_js, 

    system_image, system_statics, system_html, system_css, system_js,
));


// 监听任务
exports.watch = () => {
    // 产品端监听
    gulp.watch('./web-res/**', webTask);

    // 管理端监听
    gulp.watch('./system-res/**', systemTask);
};


// 导出任务
exports.web = webTask;
exports.system = systemTask;

// 默认任务
exports.default = gulp.parallel(webTask, systemTask);

