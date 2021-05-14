$(function(){
    $('#form-pub').on('submit',function(){
        var fd=new FormData($(this)[0])
        fd.append('state',art_state)
        $('#img').cropper('getCroppedCanvas',{width:400,height:280}).toBolob(function Blob(){
            fd.append ('cover_img',blob)
            publishArticle(fd)

        })

    })
    function publishArticle(fd){
        $.ajax({
            method:'post',
            url:'/my/article/add',
            data:fd,
            success(res){
                if(res.status!==0){
                    return layer.msg('发送数据失败！')
        
                }
                layer.msg('发送数据成功！')
                window.parent.document.querySelector('[href="/article/art_list.html"]').click()
            }

        })
    }
})