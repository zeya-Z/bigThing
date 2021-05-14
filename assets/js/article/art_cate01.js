$(function () {
    const layer = layui.layer
    initArtCateList()

    // 获取文章列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success(res) {
                const str = template('tpl-table', res)
                $('tbody').html(str)
            }
        })
    }

    let indexAdd = null;
    // 为添加按钮添加点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // !后添加的表单，所以是要通过代理的事件来监听提交事件
    // 通过代理事件，监听事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                //!关闭弹出层，通过索引
                //!使用layer.open方法时会有个返回值，这个值就是索引
                layer.close(indexAdd)

            }
        })
    })


    let indexEdit = null
    const form = layui.form
    // 为编辑按钮添加点击事件（代理的形式）
    $('tbody').on('click', '.btn-edit', function () {
        // alert(11)
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()

        })
        let id = $(this).attr('data-id')
        // console.log(id);
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success(res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })
    // 通过代理事件，监听编辑表单提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类失败！')
                }
                layer.msg('更新分类成功！')
                //!关闭弹出层，通过索引
                //!使用layer.open方法时会有个返回值，这个值就是索引
                layer.close(indexEdit)
                initArtCateList()

            }
        })
    })
    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'get',
                url: `/my/article/deletecate/${id}`,
                success(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })

        });

    })

})