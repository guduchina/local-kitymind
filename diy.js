var html = '';
html += '<button class="diy export" data-type="json">导出json</button>',
html += '<button class="diy export" data-type="md">导出md</button>',
html += '<button class="diy export" data-type="km">导出km</button>',
html += '<button class="diy">',
html += '导入<input type="file" id="fileInput">',
html += '</button>';

$('.editor-title').append(html);
$('.diy').css({
    'height': '30px',
    'line-height': '30px',
    'margin-top': '5px',
    'float': 'right',
    'color': '#333',
    'overflow': 'hidden',
    'position': 'relative'
}).find('input').css({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'inline-block',
    opacity: 0
});;
// 导出
$(document).on('click', '.export', function(event) {
    event.preventDefault();
    var type = $(this).data('type'),
            exportType;
    switch(type){
        case 'km':
            exportType = 'json';
            break;
        case 'md':
            exportType = 'markdown';
            break;
        default:
            exportType = type;
            break;
    }
    editor.minder.exportData(exportType).then(function(content){
        switch(exportType){
            case 'json':
                console.log($.parseJSON(content));
                break;
            default:
                console.log(content);
                break;
        }
        // var aLink = document.createElement('a');
        // var evt = document.createEvent("HTMLEvents");
        // var blob = new Blob([content]);

        // evt.initEvent("click", false, false);
        // aLink.download = $('#node_text1').text()+'.'+type;
        // aLink.href = URL.createObjectURL(blob);
        // aLink.dispatchEvent(evt);

        // 由于chrome较高版本中无法实现自动触发event，所以改用以下方法进行导出
        var fileName = $('#node_text1').text()+'.'+type;
        var aLink = document.createElement('a');
        // 点击后自动删除当前a标签
        aLink.onclick = function() {
            $(this).remove();
        };

        var node = document.createTextNode(fileName);
        aLink.appendChild(node);
        var blob = new Blob([content]);
        aLink.download = fileName;
        aLink.href = URL.createObjectURL(blob);
        $('.editor-title').append(aLink);
    });
});

// 导入
window.onload = function() {
    var fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0],
                // textType = /(md|km)/,
                fileType = file.name.substr(file.name.lastIndexOf('.')+1);
        console.log(file);
        switch(fileType){
            case 'md':
                fileType = 'markdown';
                break;
            case 'km':
            case 'json':
                fileType = 'json';
                break;
            default:
                console.log("File not supported!");
                alert('只支持.km、.md、.json文件');
                return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var content = reader.result;
            editor.minder.importData(fileType, content).then(function(data){
                console.log(data)
                $(fileInput).val('');
            });
        }
        reader.readAsText(file);
    });
}
