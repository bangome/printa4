"use strict";(self.webpackChunkprinta4=self.webpackChunkprinta4||[]).push([[792],{397:(e,t,n)=>{var s=n(6512),i=n.n(s),o=n(6540),r=n(961),a=n(6087),l=n(4848);const c=a.AH`
  background-color: #0052CC;
  color: white;
  padding: 16px 24px;
  display: flex;
  align-items: center;
`,d=a.AH`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
`,h=e=>{let{title:t}=e;return(0,l.jsx)("header",{css:c,children:(0,l.jsx)("h1",{css:d,children:t})})},x=96/25.4,g=a.AH`
  display: flex;
  justify-content: center;
  padding: 20px;
`,p=e=>a.AH`
  width: ${210*x}px;
  height: ${297*x}px;
  background-color: white;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  font-family: ${e.fontFamily};
`,f=e=>a.AH`
  position: absolute;
  top: ${e.header.show?"40px":"0"};
  left: 0;
  right: 0;
  bottom: ${e.footer.show?"40px":"0"};
  padding: ${e.margin.top}px ${e.margin.right}px ${e.margin.bottom}px ${e.margin.left}px;
  overflow: auto;
  font-size: ${e.fontSize.body}px;
  
  h1 {
    font-size: ${e.fontSize.heading1}px;
  }
  
  h2 {
    font-size: ${e.fontSize.heading2}px;
  }
`,u=e=>a.AH`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  padding: 10px ${e.margin.right}px;
  text-align: ${e.header.align};
  border-bottom: 1px solid #eee;
  font-size: 10px;
  color: #666;
`,m=e=>a.AH`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  padding: 10px ${e.margin.right}px;
  text-align: ${e.footer.align};
  border-top: 1px solid #eee;
  font-size: 10px;
  color: #666;
`,j=a.AH`
  position: absolute;
  right: 10px;
  bottom: 10px;
`,b=e=>{let{title:t,content:s,settings:i}=e;const r=(0,o.useRef)(null),[a,c]=(0,o.useState)(null);return(0,o.useEffect)((()=>{(async()=>{const e=await Promise.all([n.e(51),n.e(551)]).then(n.bind(n,2932));c(e)})()}),[]),(0,o.useEffect)((()=>{if(r.current&&s&&a){r.current.innerHTML="";const e=document.createElement("h1");e.textContent=t,e.style.fontSize=`${i.fontSize.title}px`,e.style.fontFamily=i.fontFamily,e.style.marginBottom="20px",r.current.appendChild(e);const n=document.createElement("div");n.innerHTML=s,a.applyStyles(n,i),r.current.appendChild(n)}}),[t,s,i,a]),(0,l.jsx)("div",{css:g,children:(0,l.jsxs)("div",{css:p(i),children:[i.header.show&&(0,l.jsx)("div",{css:u(i),children:i.header.text}),(0,l.jsx)("div",{css:f(i),ref:r}),i.footer.show&&(0,l.jsxs)("div",{css:m(i),children:[i.footer.text,i.footer.showPageNumber&&(0,l.jsx)("span",{css:j,children:"1"})]})]})})};var v=n(6586),w=n.n(v);const y=a.AH`
  padding: 16px;
`,C=a.AH`
  margin-bottom: 24px;
`,F=a.AH`
  font-size: 18px;
  margin-bottom: 16px;
  color: #172B4D;
`,H=a.AH`
  font-size: 14px;
  margin-bottom: 12px;
  color: #172B4D;
`,S=a.AH`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`,A=a.AH`
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  color: #6B778C;
`,k=a.AH`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #172B4D;
`,$=a.AH`
  width: 100%;
  padding: 8px;
  border: 1px solid #DFE1E6;
  border-radius: 3px;
  margin-bottom: 12px;
  
  &:focus {
    border-color: #4C9AFF;
    outline: none;
  }
`,z=a.AH`
  width: 100%;
  padding: 8px;
  border: 1px solid #DFE1E6;
  border-radius: 3px;
  margin-bottom: 12px;
  background-color: white;
  
  &:focus {
    border-color: #4C9AFF;
    outline: none;
  }
`,P=a.AH`
  background-color: #0052CC;
  color: white;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  width: 100%;
  margin-top: 16px;
  
  &:hover {
    background-color: #0065FF;
  }
`,E=e=>{let{settings:t,onSettingsChange:n}=e;const s=(e,s)=>{n({fontSize:{...t.fontSize,[e]:w()(s)}})},i=(e,s)=>{n({margin:{...t.margin,[e]:w()(s)}})},o=(e,s)=>{n({header:{...t.header,[e]:s}})},r=(e,s)=>{n({footer:{...t.footer,[e]:s}})};return(0,l.jsxs)("div",{css:y,children:[(0,l.jsx)("h2",{css:F,children:"PDF 설정"}),(0,l.jsxs)("section",{css:C,children:[(0,l.jsx)("h3",{css:H,children:"여백 (px)"}),(0,l.jsxs)("div",{css:S,children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{css:A,htmlFor:"margin-top",children:"상단"}),(0,l.jsx)("input",{id:"margin-top",type:"number",value:t.margin.top,min:"0",max:"100",onChange:e=>i("top",e.target.value),css:$})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{css:A,htmlFor:"margin-right",children:"우측"}),(0,l.jsx)("input",{id:"margin-right",type:"number",value:t.margin.right,min:"0",max:"100",onChange:e=>i("right",e.target.value),css:$})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{css:A,htmlFor:"margin-bottom",children:"하단"}),(0,l.jsx)("input",{id:"margin-bottom",type:"number",value:t.margin.bottom,min:"0",max:"100",onChange:e=>i("bottom",e.target.value),css:$})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{css:A,htmlFor:"margin-left",children:"좌측"}),(0,l.jsx)("input",{id:"margin-left",type:"number",value:t.margin.left,min:"0",max:"100",onChange:e=>i("left",e.target.value),css:$})]})]})]}),(0,l.jsxs)("section",{css:C,children:[(0,l.jsx)("h3",{css:H,children:"글꼴"}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{css:A,htmlFor:"font-family",children:"글꼴 패밀리"}),(0,l.jsxs)("select",{id:"font-family",value:t.fontFamily,onChange:e=>{n({fontFamily:e.target.value})},css:z,children:[(0,l.jsx)("option",{value:"Arial",children:"Arial"}),(0,l.jsx)("option",{value:"Times New Roman",children:"Times New Roman"}),(0,l.jsx)("option",{value:"Courier New",children:"Courier New"}),(0,l.jsx)("option",{value:"Georgia",children:"Georgia"}),(0,l.jsx)("option",{value:"Verdana",children:"Verdana"}),(0,l.jsx)("option",{value:"Helvetica",children:"Helvetica"}),(0,l.jsx)("option",{value:"'Noto Sans KR', sans-serif",children:"Noto Sans KR"})]})]})]}),(0,l.jsxs)("section",{css:C,children:[(0,l.jsx)("h3",{css:H,children:"글꼴 크기 (px)"}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{css:A,htmlFor:"font-title",children:"제목"}),(0,l.jsx)("input",{id:"font-title",type:"number",value:t.fontSize.title,min:"8",max:"36",onChange:e=>s("title",e.target.value),css:$})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{css:A,htmlFor:"font-heading1",children:"헤딩 1"}),(0,l.jsx)("input",{id:"font-heading1",type:"number",value:t.fontSize.heading1,min:"8",max:"30",onChange:e=>s("heading1",e.target.value),css:$})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{css:A,htmlFor:"font-heading2",children:"헤딩 2"}),(0,l.jsx)("input",{id:"font-heading2",type:"number",value:t.fontSize.heading2,min:"8",max:"24",onChange:e=>s("heading2",e.target.value),css:$})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{css:A,htmlFor:"font-body",children:"본문"}),(0,l.jsx)("input",{id:"font-body",type:"number",value:t.fontSize.body,min:"8",max:"18",onChange:e=>s("body",e.target.value),css:$})]})]}),(0,l.jsxs)("section",{css:C,children:[(0,l.jsx)("h3",{css:H,children:"헤더"}),(0,l.jsx)("div",{children:(0,l.jsxs)("label",{css:k,children:[(0,l.jsx)("input",{type:"checkbox",checked:t.header.show,onChange:e=>o("show",e.target.checked)}),"헤더 표시"]})}),t.header.show&&(0,l.jsxs)(l.Fragment,{children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{css:A,htmlFor:"header-text",children:"헤더 텍스트"}),(0,l.jsx)("input",{id:"header-text",type:"text",value:t.header.text,onChange:e=>o("text",e.target.value),css:$})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{css:A,htmlFor:"header-align",children:"정렬"}),(0,l.jsxs)("select",{id:"header-align",value:t.header.align,onChange:e=>o("align",e.target.value),css:z,children:[(0,l.jsx)("option",{value:"left",children:"왼쪽"}),(0,l.jsx)("option",{value:"center",children:"가운데"}),(0,l.jsx)("option",{value:"right",children:"오른쪽"})]})]})]})]}),(0,l.jsxs)("section",{css:C,children:[(0,l.jsx)("h3",{css:H,children:"푸터"}),(0,l.jsx)("div",{children:(0,l.jsxs)("label",{css:k,children:[(0,l.jsx)("input",{type:"checkbox",checked:t.footer.show,onChange:e=>r("show",e.target.checked)}),"푸터 표시"]})}),t.footer.show&&(0,l.jsxs)(l.Fragment,{children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{css:A,htmlFor:"footer-text",children:"푸터 텍스트"}),(0,l.jsx)("input",{id:"footer-text",type:"text",value:t.footer.text,onChange:e=>r("text",e.target.value),css:$})]}),(0,l.jsx)("div",{children:(0,l.jsxs)("label",{css:k,children:[(0,l.jsx)("input",{type:"checkbox",checked:t.footer.showPageNumber,onChange:e=>r("showPageNumber",e.target.checked)}),"페이지 번호 표시"]})}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{css:A,htmlFor:"footer-align",children:"정렬"}),(0,l.jsxs)("select",{id:"footer-align",value:t.footer.align,onChange:e=>r("align",e.target.value),css:z,children:[(0,l.jsx)("option",{value:"left",children:"왼쪽"}),(0,l.jsx)("option",{value:"center",children:"가운데"}),(0,l.jsx)("option",{value:"right",children:"오른쪽"})]})]})]})]}),(0,l.jsx)("button",{css:P,onClick:()=>{window.parent.postMessage({action:"generatePdf",settings:t},"*")},children:"PDF 생성"})]})};const D=new class{constructor(){this.baseUrl="/api"}async getContext(){const e=await fetch(`${this.baseUrl}/context`);if(!e.ok)throw new Error("컨텍스트 정보를 가져오는데 실패했습니다.");return e.json()}async getPageContent(e){const t=await fetch(`${this.baseUrl}/page/${e}`);if(!t.ok)throw new Error("페이지 콘텐츠를 가져오는데 실패했습니다.");return t.json()}async getPageHtmlContent(e){const t=await fetch(`${this.baseUrl}/page/${e}/html`);if(!t.ok)throw new Error("페이지 HTML 콘텐츠를 가져오는데 실패했습니다.");return t.text()}async getPageAttachments(e){const t=await fetch(`${this.baseUrl}/page/${e}/attachments`);if(!t.ok)throw new Error("페이지 첨부 파일을 가져오는데 실패했습니다.");return t.json()}},N={margin:{top:20,right:20,bottom:20,left:20},fontSize:{title:18,heading1:16,heading2:14,body:12},fontFamily:"'Noto Sans KR', sans-serif",header:{show:!0,text:"",align:"center"},footer:{show:!0,text:"",showPageNumber:!0,align:"center"}},M=a.AH`
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
`,R=a.AH`
  display: flex;
  flex: 1;
  overflow: hidden;
`,B=a.AH`
  flex: 1;
  padding: 20px;
  overflow: auto;
  background-color: #f4f5f7;
`,U=a.AH`
  width: 300px;
  background-color: #ffffff;
  border-left: 1px solid #dfe1e6;
  overflow-y: auto;
`,I=a.AH`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  font-size: 16px;
`,G=a.AH`
  padding: 16px;
  background-color: #ffebe6;
  color: #de350b;
  border-radius: 3px;
  margin: 16px;
`,L=()=>{const[e,t]=(0,o.useState)(null),[n,s]=(0,o.useState)(""),[r,a]=(0,o.useState)(""),[c,d]=(0,o.useState)(N),[x,g]=(0,o.useState)(!0),[p,f]=(0,o.useState)(null);(0,o.useEffect)((()=>{const e=new(i())(window.location.search).get("pageId");e?t(e):f("페이지 ID가 제공되지 않았습니다.")}),[]),(0,o.useEffect)((()=>{if(!e)return;(async()=>{try{g(!0);const t=await D.getPageContent(e),n=await D.getPageHtmlContent(e);s(t.title),a(n),d((e=>({...e,header:{...e.header,text:t.title},footer:{...e.footer,text:`Generated from Confluence - ${(new Date).toLocaleDateString()}`}})))}catch(e){f("페이지 콘텐츠를 가져오는데 실패했습니다.")}finally{g(!1)}})()}),[e]);return(0,l.jsxs)("div",{css:M,children:[(0,l.jsx)(h,{title:"A4 PDF Export"}),p&&(0,l.jsx)("div",{css:G,children:p}),x?(0,l.jsx)("div",{css:I,children:"콘텐츠를 불러오는 중..."}):(0,l.jsxs)("div",{css:R,children:[(0,l.jsx)("div",{css:B,children:(0,l.jsx)(b,{title:n,content:r,settings:c})}),(0,l.jsx)("div",{css:U,children:(0,l.jsx)(E,{settings:c,onSettingsChange:e=>{d({...c,...e})}})})]})]})};r.render((0,l.jsx)(o.StrictMode,{children:(0,l.jsx)(L,{})}),document.getElementById("root")),window.addEventListener("message",(async e=>{if(e.data&&"generatePdf"===e.data.action)try{const t=new(i())(window.location.search).get("pageId");if(!t)throw new Error("페이지 ID가 제공되지 않았습니다.");const s=await D.getPageContent(t),o=await D.getPageHtmlContent(t),r=(await Promise.all([n.e(51),n.e(46),n.e(796),n.e(505),n.e(242)]).then(n.bind(n,7871))).default;await r.generatePdf(s.title,o,e.data.settings),window.parent.postMessage({action:"pdfGenerated",success:!0},"*")}catch(e){window.parent.postMessage({action:"pdfGenerated",success:!1,error:e.message},"*")}}))}},e=>{e.O(0,[51,604,753,705],(()=>{return t=397,e(e.s=t);var t}));e.O()}]);