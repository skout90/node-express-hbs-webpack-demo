import "../css/style.css";

require("@babel/polyfill");

// const $ = require("jquery")
// // jquery
// $.ajaxSetup({
//     complete: function (XMLHttpRequest, textStatus) {
//         var res = XMLHttpRequest.responseText;
//         try {
//             var data = JSON.parse(res);
//             if (res.errorCode == 401) {
//                 // 로그인 정보가 만료되었습니다. 다시 로그인하십시오.
//                 setTimeout(function () {
//                     window.location.href = "/#login";
//                 }, 3000)
//             }
//         } catch (e) {

//         }
//     }
// });