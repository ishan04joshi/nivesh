import{C as K}from"./index.esm.a1830a40.js";import{m as W,S as c,B as E,u as X,d as Y,e as Z,r as g,f as $,a as U,b as r,L as q,j as o,H as y,I as P,g as ee,E as te,A as se,h as re,i as oe,k as ie,n as ae,T as b,o as A,t as v,p as ne,q as ce,c as _,P as le,v as de,w as ue,x as ge,y as he}from"./index.9689f1a6.js";const pe=W(c),B=W(E),me={hidden:{scale:0},animate:{scale:1,transition:{staggerChildren:.5,delayChildren:.4}}},fe={hidden:{opacity:0},animate:{opacity:1}},ye=()=>{const n=X();Y(),Z();const[k,D]=g.exports.useState(1),[V,H]=g.exports.useState(10);$();const{user:h}=U(),[z,Se]=g.exports.useState([]),[p,M]=g.exports.useState([]),[we,R]=g.exports.useState([]),[F,l]=g.exports.useState(!1);g.exports.useState([]);const[f,G]=g.exports.useState(""),m=g.exports.useMemo(()=>f===""||!f?p:p.filter(e=>e.firstName.toLowerCase().includes(f.toLowerCase())||e.lastName.toLowerCase().includes(f.toLowerCase())),[f,p]),C=async()=>{var e,a;try{l(!0);const{data:t}=await de(k,V);return l(!1),t.error?n({title:"Error",description:t.message,status:"error",duration:3e3,isClosable:!0,position:"top-right"}):(M(t==null?void 0:t.data),R(Object.values(t==null?void 0:t.data)),n({title:"Success",description:t.message,status:"success",duration:3e3,isClosable:!0,position:"bottom-right"}))}catch(t){l(!1),console.error(t),n({title:"Error",description:((a=(e=t==null?void 0:t.response)==null?void 0:e.data)==null?void 0:a.message)||"Something went wrong",status:"error",duration:3e3,isClosable:!0,position:"bottom-right"})}},J=async(e,a,t)=>{var s,S;try{if(!e||!a||isNaN(t))return n({title:"Error",description:"Invalid Amount!",status:"error",duration:3e3,isClosable:!0});l(!0);const{data:d}=await ue(e,a,t);return l(!1),d.error?n({title:"Error",description:d.message,status:"error",duration:3e3,isClosable:!0,position:"top-right"}):(C(),n({title:"Success",description:d.message,status:"success",duration:3e3,isClosable:!0,position:"bottom-right"}))}catch(d){console.error(d),n({title:"Error",description:((S=(s=d==null?void 0:d.response)==null?void 0:s.data)==null?void 0:S.message)||"Something went wrong",status:"error",duration:3e3,isClosable:!0,position:"top-right"})}},O=async e=>{var a,t;try{l(!0);const{data:s}=await ge({id:e});if(l(!1),s.error)return n({title:"Error",description:s.message,status:"error",duration:3e3,isClosable:!0,position:"bottom-right"});C(),n({title:"Success",description:s.message,status:"success",duration:3e3,isClosable:!0,position:"bottom-right"})}catch(s){l(!1),console.error(s),n({title:"Error",description:((t=(a=s==null?void 0:s.response)==null?void 0:a.data)==null?void 0:t.message)||"Something went wrong",status:"error",duration:3e3,isClosable:!0,position:"bottom-right"})}},Q=async e=>{var a,t;try{l(!0);const{data:s}=await he({id:e});if(l(!1),s.error)return n({title:"Error",description:s.message,status:"error",duration:3e3,isClosable:!0,position:"bottom-right"});C(),n({title:"Success",description:s.message,status:"success",duration:3e3,isClosable:!0,position:"bottom-right"})}catch(s){l(!1),console.error(s),n({title:"Error",description:((t=(a=s==null?void 0:s.response)==null?void 0:a.data)==null?void 0:t.message)||"Something went wrong",status:"error",duration:3e3,isClosable:!0,position:"bottom-right"})}};return g.exports.useEffect(()=>{C()},[k,V]),F?r(q,{}):o(E,{sx:{minHeight:"90vh",display:"flex",flexDirection:"column",pb:4,py:4,px:2},children:[o(c,{direction:"row",justifyContent:"space-between",children:[r(y,{color:"gray.600",children:"Market Values"}),r(P,{w:"150px",placeholder:"Search",onChange:e=>G(e.target.value)})]}),o(pe,{variants:me,initial:"hidden",animate:"animate",direction:"column",spacing:2,sx:{px:{sm:2,lg:6},pt:4},children:[(m==null?void 0:m.length)===0&&o(c,{direction:"column",spacing:3,justifyContent:"center",alignItems:"center",h:"80vh",children:[r(ee,{animationData:te,autoPlay:!0,loop:!0,style:{height:"60vh",width:"60vw"}}),r(y,{children:"No Market Values Assigned!"})]}),r(se,{defaultIndex:[0],children:r(c,{spacing:3,children:m==null?void 0:m.map((e,a)=>{var t,s,S,d,j;return o(re,{children:[r(B,{variants:fe,px:8,py:4,rounded:"lg",shadow:"lg",bg:oe("white","gray.800"),maxW:"100%",children:r(ie,{_focus:{border:"0px"},children:r(c,{ml:2,w:"100%",direction:"row",spacing:4,alignItems:"center",justifyContent:"space-between",children:o(c,{direction:"row",spacing:2,divider:r(ae,{}),children:[o(c,{spacing:1,children:[o(y,{size:"md",alignSelf:"center",color:"gray.600",children:[e==null?void 0:e.firstName," ",e==null?void 0:e.lastName]}),o(b,{size:"xs",alignSelf:"center",color:"gray.600",children:["PAN: ",(t=e==null?void 0:e.pan)==null?void 0:t.id]})]}),o(A,{size:"lg",colorScheme:"blue",children:["Active Funds: ",(s=e==null?void 0:e.funds)==null?void 0:s.length]}),o(A,{size:"lg",colorScheme:"green",children:["Total Invested:"," ",v((S=e==null?void 0:e.funds)==null?void 0:S.reduce((i,u)=>i+(u==null?void 0:u.invested),0))]}),o(A,{size:"lg",colorScheme:"red",children:["Total Market Value:"," ",v((d=e==null?void 0:e.funds)==null?void 0:d.reduce((i,u)=>i+(u==null?void 0:u.marketValue),0))]})]})})})},e._id),r(ne,{pb:4,border:"2px",rounded:"lg",borderTop:"0px",borderColor:"gray.400",children:o(B,{px:2,py:2,children:[r(c,{direction:"column",spacing:3,children:(j=e==null?void 0:e.funds)==null?void 0:j.map((i,u)=>{var I,N,T;return o(c,{direction:"row",spacing:3,children:[o(y,{color:"gray.600",fontSize:"sm",alignSelf:"center",children:["Fund Name: ",(I=i==null?void 0:i.id)==null?void 0:I.name]}),o(b,{color:"gray.400",fontSize:"xs",alignSelf:"center",children:["Invested:"," ",r("strong",{children:v(i==null?void 0:i.invested)})]}),o(b,{color:"gray.400",fontSize:"xs",alignSelf:"center",children:["Active Recurring Total:"," ",r("strong",{children:v(i==null?void 0:i.recurringTotal)})]}),o(c,{direction:"row",spacing:1,children:[o(b,{color:"gray.400",fontSize:"xs",alignSelf:"center",children:["Market Value:"," "]}),r(P,{w:"170px",type:"number",value:(T=(N=p[a])==null?void 0:N.funds[u])==null?void 0:T.marketValue,onChange:x=>{const w=[...p];w[a].funds[u].marketValue=+x.target.value||0,M(w)}}),r(ce,{icon:r(K,{}),"aria-label":"edit",colorScheme:"blue",onClick:()=>{var x,w,L;return J(e==null?void 0:e._id,(x=i==null?void 0:i.id)==null?void 0:x._id,(L=(w=p[a])==null?void 0:w.funds[u])==null?void 0:L.marketValue)}})]})]},i==null?void 0:i._id)})}),o(c,{direction:"row",spacing:1,pt:4,children:[(e==null?void 0:e.status)==="pending"&&(h==null?void 0:h.isAdmin)&&r(_,{alignSelf:"center",onClick:()=>O(e==null?void 0:e._id),colorScheme:"green",size:"sm",variant:"solid",children:"Complete"}),(e==null?void 0:e.status)==="pending"&&(h==null?void 0:h.isAdmin)&&r(c,{direction:"row",spacing:1,children:(h==null?void 0:h.isAdmin)&&r(_,{onClick:()=>Q(e==null?void 0:e._id),colorScheme:"red",size:"sm",variant:"solid",children:"Reject"})})]})]})})]},e==null?void 0:e._id)})})})]}),r(E,{sx:{},children:(z==null?void 0:z.length)>0&&r(le,{defaultPageSize:V,defaultPage:k,total:500,paginationProps:{display:"flex",justifyContent:"center",marginTop:"2em"},pageNeighbours:1,showQuickJumper:!0,responsive:!0,onChange:e=>D(e),onShowSizeChange:(e,a)=>H(parseInt(a)),showSizeChanger:!0})})]})};export{ye as default};