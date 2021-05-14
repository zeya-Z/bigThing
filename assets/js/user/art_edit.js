$(function () {

    initCate()
    initEditor()
    const layer = layui.layer
    const form = layui.form
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章列表失败！')
                }
                // 调用模板引擎渲染下拉菜单
                let str = template('tpl-cate', res)
                $('[name=cate_id]').html(str)
                // !调用form.render函数
                form.render()
                getDetails()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    // $image.cropper(options)

    // 为选择封面的按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        const files = e.target.files
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域   
            .attr('src', newImgURL)  // 重新设置图片路径  
            .cropper(options)        // 重新初始化裁剪区域
    })

    let art_state = '已发布';
    //  监听存为草稿按钮的点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 监听表单的提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 快速创建一个formdata对象
        var fd = new FormData($(this)[0])
        // 将文章的发布状态存到fd中
        fd.append('state', art_state)
        fd.append('Id',obj.id)
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)

                //   发起AJAX数据请求
                publishArticle(fd)

            })

        // 定义一个发布文章的方法
        function publishArticle() {
            $.ajax({
                method: 'post',
                url: '/my/article/edit',
                data: fd,
                contentType: false,
                processData: false,
                success(res) {
                    if (res.status !== 0) {
                        return layer.msg('发布文章失败')
                    }
                    layer.msg('发布文章成功！')
                    location.href = '/article/art_list01.html'
                }
            })
        }
    })

    const obj = {}
    function getDetails() {
        // 根据文章ID获取详情并填充
        // /article/art_edit.html?id=8888
        //console.log(location.search);  //?id=11269
        //console.log(location.search.split('?'))//["", "id=11269"]
        //console.log(location.search.split('?')[1]);

        const arr = location.search.split('?')[1].split('&')
       
        for (let i = 0; i < arr.length; i++) {
            const c = arr[i].split('=')
            obj[c[0]] = c[1]
        }
        console.log(obj);
        $.ajax({
            url: `/my/article/${obj.id}`,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章详情失败！')
                }
                form.val('art-edit', res.data)
                // 解决富文本没有内容的问题（选择这个富文本，手动填充内容）
                setTimeout(function(){
                    document.getElementById('content_ifr').contentDocument.getElementById('tinymce').innerHTML=res.data.content
                },1000)
               
                // 把后端返回的图片给Img的src
            $('#image').attr('src','http://api-breakingnews-web.itheima.net'+res.data.cover_img)
            $image.cropper(options)
            }
        })

    }

})