$(function () {
    const form = layui.form
    const laypage = layui.laypage
    //美化时间过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //  设置补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n

    }

    // 设置参数查询的对象，可将请求参数对象提交到服务器
    let q = {
        pagenum: 1,//页码值，默认第一页显示
        pagesize: 2,//每页显示的几条数据，默认显示两条
        cate_id: '',//文章分类的Id
        state: '',//文章的发布状态
    }
    initTable()
    initCate()

    const layer = layui.layer;
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取数据失败！')
                }

                // 渲染数据（模板引擎）
                const str = template('tpl_table', res)
                $('tbody').html(str)
                renderPage(res.total)
            }


        })
    }
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据分类失败！')
                }
                let str = template('tpl-cate', res)
                $('[name=cate_id]').html(str)
                form.render()
            }
        })
    }
     //  筛选功能
     $('#form-search').on('submit', function (e) {
        e.preventdefault()
        const cate_id = $('[name=cate_id]').val()
        const state = $('[name=state').val()
        q.cate_id = cate_id;
        q.state = state;
        initTable()
    })

    //    定义渲染分页的方法
    function renderPage(total) {

        laypage.render({
            elem: 'pageBox',//设置容器中的id
            count: total,//总数据条数
            limit: q.pagesize,//每页显示的数据条数
            curr: q.pagenum,//设置默认筛选的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 最新的页码给查询对象
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                // first是
                if (!first) {
                    initTable()
                }
            }
        })
    }

    $('tbody').on('click', '.btn-delete', function () {
        const len = $('btn-delete').length;// 获取删除按钮的个数
        const id = $(this).attr('data-id') // 获取到文章的 id
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success(res) {
                   
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // !当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // !如果没有剩余的数据了,则让页码值 减1 之后,
                    // 再重新调用 initTable 方法
                    // 4
                    if (len === 1) {
                        // !如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // !页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;

                    }
                    initTable()
                }
            })
            layer.close(index)

        })
    })


})