(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[459],{3236:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/login",function(){return t(9729)}])},9729:function(e,n,t){"use strict";t.r(n);var r=t(7568),i=t(1799),s=t(9396),o=t(655),a=t(5893),l=t(9823),u=t(2389),c=t(6390),d=t(612),g=t(1577),h=t(1664),m=t.n(h),p=t(7294),f=t(196),x=t(1163),y=t(5331),Z=t(7783),v=t(9008),w=t.n(v),b=t(4903),k=t(9446),_=l.Z.Title,j={formContainer:{backgroundColor:"white",padding:"2rem",boxShadow:"0 0 10px 5px rgba(0, 0, 0, 0.2)",height:"fit-content",maxWidth:"600px",width:"100%"},submitButton:{width:"100%",marginTop:"1rem"}},P={initial:{opacity:0,x:-150,y:0},animate:{opacity:1,x:0,y:0},exit:{opacity:0,x:-150,y:0}},C=function(e){var n,t=e.setFromNoHeaderRoute,h=(0,p.useState)({}),v=h[0],C=h[1],S=(0,p.useState)(!1),T=S[0],E=S[1],F=(0,b.TL)(),I=(0,b.CG)(k.Mb),N=(0,x.useRouter)();(0,p.useEffect)(function(){t(!0),I&&N.push("/")},[I,t,N]);var L=(n=(0,r.Z)(function(e){var n,t,r,i,s;return(0,o.__generator)(this,function(o){switch(o.label){case 0:E(!0),o.label=1;case 1:return o.trys.push([1,4,5,6]),u.ZP.loading({content:"Signing in server...",key:"login",duration:60}),[4,f.ZP.post("/auth/login",e)];case 2:return n=o.sent(),u.ZP.loading({content:"Signing in firebase...",key:"login",duration:60}),t=(0,Z.v0)(),[4,(0,Z._p)(t,n.data.firebaseToken)];case 3:return r=o.sent(),console.log({userCredentials:r}),F((0,k.x4)(n.data.user)),localStorage.setItem("token",n.data.token),localStorage.setItem("firebaseToken",n.data.firebaseToken),u.ZP.success({content:"Successfully logged in!",key:"login"}),console.log(n),[3,6];case 4:return i=o.sent(),console.log(i),f.ZP.isAxiosError(i)&&C(null===(s=i.response)||void 0===s?void 0:s.data.errors),u.ZP.error({content:v.general||"Failed to login!",key:"login"}),[3,6];case 5:return E(!1),[7];case 6:return[2]}})}),function(e){return n.apply(this,arguments)}),A=function(e){console.log("Failed:",e)};return(0,a.jsxs)(y.E.div,{variants:P,transition:{type:"linear"},style:j.formContainer,children:[(0,a.jsx)(w(),{children:(0,a.jsx)("title",{children:"Login"})}),(0,a.jsxs)(c.Z,{name:"login",initialValues:{remember:!0},size:"large",onFinish:L,onFinishFailed:A,autoComplete:"off",layout:"vertical",children:[(0,a.jsx)(_,{style:{textAlign:"center"},children:"Login"}),(0,a.jsx)(c.Z.Item,{label:"Username",name:"username",rules:[{required:!0,message:"Please input your username!"}],help:null==v?void 0:v.username,validateStatus:(null==v?void 0:v.username)?"error":"",children:(0,a.jsx)(d.Z,{onChange:function(){return C((0,s.Z)((0,i.Z)({},v),{username:void 0}))}})}),(0,a.jsx)(c.Z.Item,{label:"Password",name:"password",rules:[{required:!0,message:"Please input your password!"}],help:null==v?void 0:v.password,validateStatus:(null==v?void 0:v.password)?"error":"",children:(0,a.jsx)(d.Z.Password,{onChange:function(){return C((0,s.Z)((0,i.Z)({},v),{password:void 0}))}})}),(0,a.jsx)(c.Z.Item,{children:(0,a.jsx)(g.Z,{type:"primary",htmlType:"submit",style:j.submitButton,loading:T,children:"Login"})}),(0,a.jsxs)(c.Z.Item,{style:{textAlign:"right"},children:["Or"," ",(0,a.jsx)(m(),{href:"/register",children:(0,a.jsx)(l.Z.Link,{children:"register now!"})})]})]})]})};n.default=C}},function(e){e.O(0,[78,774,888,179],function(){return e(e.s=3236)}),_N_E=e.O()}]);