function t(t,e,s,i){var o,n=arguments.length,r=n<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,s,r):o(e,s))||r);return n>3&&r&&Object.defineProperty(e,s,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new n(s,t,i)},a=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:f}=Object,u=globalThis,g=u.trustedTypes,m=g?g.emptyScript:"",v=u.reactiveElementPolyfillSupport,$=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},x=(t,e)=>!c(t,e),w={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const n=i?.call(this);o?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const t=f(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i;const n=o.fromAttribute(e,t.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const n=this.constructor;if(!1===i&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??x)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[$("elementProperties")]=new Map,b[$("finalized")]=new Map,v?.({ReactiveElement:b}),(u.reactiveElementVersions??=[]).push("2.1.2");const _=globalThis,k=t=>t,A=_.trustedTypes,E=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,M="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+S,P=`<${C}>`,U=document,O=()=>U.createComment(""),z=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,T="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,F=/>/g,D=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,W=/"/g,I=/^(?:script|style|textarea|title)$/i,B=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),L=B(1),V=B(2),q=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),Z=new WeakMap,J=U.createTreeWalker(U,129);function K(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const Y=(t,e)=>{const s=t.length-1,i=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=N;for(let e=0;e<s;e++){const s=t[e];let a,c,l=-1,h=0;for(;h<s.length&&(r.lastIndex=h,c=r.exec(s),null!==c);)h=r.lastIndex,r===N?"!--"===c[1]?r=H:void 0!==c[1]?r=F:void 0!==c[2]?(I.test(c[2])&&(o=RegExp("</"+c[2],"g")),r=D):void 0!==c[3]&&(r=D):r===D?">"===c[0]?(r=o??N,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?D:'"'===c[3]?W:j):r===W||r===j?r=D:r===H||r===F?r=N:(r=D,o=void 0);const d=r===D&&t[e+1].startsWith("/>")?" ":"";n+=r===N?s+P:l>=0?(i.push(a),s.slice(0,l)+M+s.slice(l)+S+d):s+S+(-2===l?e:d)}return[K(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Q{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[c,l]=Y(t,e);if(this.el=Q.createElement(c,s),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=J.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(M)){const e=l[n++],s=i.getAttribute(t).split(S),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:s,ctor:"."===r[1]?it:"?"===r[1]?ot:"@"===r[1]?nt:st}),i.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(I.test(i.tagName)){const t=i.textContent.split(S),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),J.nextNode(),a.push({type:2,index:++o});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===C)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(S,t+1));)a.push({type:7,index:o}),t+=S.length-1}o++}}static createElement(t,e){const s=U.createElement("template");return s.innerHTML=t,s}}function X(t,e,s=t,i){if(e===q)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const n=z(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=X(t,o._$AS(t,e.values),o,i)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??U).importNode(e,!0);J.currentNode=i;let o=J.nextNode(),n=0,r=0,a=s[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new et(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new rt(o,this,t)),this._$AV.push(e),a=s[++r]}n!==a?.index&&(o=J.nextNode(),n++)}return J.currentNode=U,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),z(t)?t===G||null==t||""===t?(this._$AH!==G&&this._$AR(),this._$AH=G):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==G&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(U.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Q.createElement(K(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new tt(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new Q(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new et(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class st{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=G,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=G}_$AI(t,e=this,s,i){const o=this.strings;let n=!1;if(void 0===o)t=X(this,t,e,0),n=!z(t)||t!==this._$AH&&t!==q,n&&(this._$AH=t);else{const i=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=X(this,i[s+r],e,r),a===q&&(a=this._$AH[r]),n||=!z(a)||a!==this._$AH[r],a===G?t=G:t!==G&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!i&&this.j(t)}j(t){t===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===G?void 0:t}}class ot extends st{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==G)}}class nt extends st{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??G)===q)return;const s=this._$AH,i=t===G&&s!==G||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==G&&(s===G||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const at=_.litHtmlPolyfillSupport;at?.(Q,et),(_.litHtmlVersions??=[]).push("3.3.3");const ct=globalThis;class lt extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new et(e.insertBefore(O(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}lt._$litElement$=!0,lt.finalized=!0,ct.litElementHydrateSupport?.({LitElement:lt});const ht=ct.litElementPolyfillSupport;ht?.({LitElement:lt}),(ct.litElementVersions??=[]).push("4.2.2");const dt=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:x},ft=(t=pt,e,s)=>{const{kind:i,metadata:o}=s;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),n.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const o=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,o,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];e.call(this,s),this.requestUpdate(i,o,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function ut(t){return(e,s)=>"object"==typeof s?ft(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function gt(t){return ut({...t,state:!0,attribute:!1})}var mt,vt;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(mt||(mt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(vt||(vt={}));var $t=function(t,e,s,i){i=i||{},s=null==s?{}:s;var o=new Event(e,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return o.detail=s,t.dispatchEvent(o),o};const yt={today:"Today",now:"Now",voltage:"Voltage",current:"Current",peak_today:"Peak today",rest:"Rest",window:"last {h}"},xt="Home Energy",wt="mdi:lightning-bolt",bt="Unmeasured",_t=6,kt=216,At=244,Et=207,Mt=253,St=1,Ct=32,Pt=5,Ut=["#ff8a5c","#4ecdc4","#b39dff","#ffd166","#8fb3ff","#5dcaa5","#ff7aa2","#c9d6e8","#f4a261","#7bdff2"],Ot="#6f84a0",zt=["#5dcaa5","#8fb3ff","#ffd166","#b39dff"],Rt=r`
  :host {
    display: block;
    min-width: 0;
    --efc-txt: #e8eef6;
    --efc-sub: #8aa0bd;
    --efc-title: #dbe6f3;
    --efc-accent: #4ecdc4;
    --efc-ok: #5dcaa5;
    --efc-warn: #ff8a5c;
    --efc-meter: #8fb3ff;
    --efc-surface: color-mix(in srgb, #9fb6d6 6%, transparent);
    --efc-surface-hi: color-mix(in srgb, #9fb6d6 10%, transparent);
    --efc-line: color-mix(in srgb, #9fb6d6 14%, transparent);
    --efc-chip: color-mix(in srgb, #9fb6d6 12%, transparent);
    --efc-border: #26425f;
    --efc-radius: 18px;
    --efc-tile-radius: 13px;
    --efc-gap: 7px;
  }

  /* Light HA theme: keep the accents, switch text/surfaces to theme colours. */
  :host([light]) {
    --efc-txt: var(--primary-text-color, #1c2733);
    --efc-sub: var(--secondary-text-color, #5b6b7d);
    --efc-title: var(--primary-text-color, #1c2733);
    --efc-border: var(--divider-color, #d5dee8);
    --efc-accent: #1fa99f;
    --efc-ok: #2fa57e;
    --efc-warn: #f0703c;
    --efc-meter: #4f7fd6;
    --efc-surface: color-mix(in srgb, #3c5a80 5%, transparent);
    --efc-surface-hi: color-mix(in srgb, #3c5a80 8%, transparent);
    --efc-line: color-mix(in srgb, #3c5a80 12%, transparent);
    --efc-chip: color-mix(in srgb, #3c5a80 9%, transparent);
  }

  ha-card {
    background: var(--ha-card-background, var(--card-background-color, none));
    border: 1px solid var(--efc-border);
    border-radius: var(--efc-radius);
    box-shadow: 0 2px 14px rgba(0, 0, 0, 0.25);
    padding: 12px;
    color: var(--efc-txt);
    overflow: hidden;
    position: relative;
    font-variant-numeric: tabular-nums;
    box-sizing: border-box;
  }

  /* ---------- header ---------- */
  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    min-width: 0;
  }
  .title-icon {
    width: 34px;
    height: 34px;
    border-radius: 11px;
    background: color-mix(in srgb, var(--efc-accent) 16%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .title-icon ha-icon { --mdc-icon-size: 20px; color: var(--efc-accent); }
  .title-text {
    flex: 1 1 auto;
    min-width: 0;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: var(--efc-title);
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .chip {
    flex-shrink: 0;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.3px;
    padding: 1px 7px;
    border-radius: 999px;
    background: var(--efc-chip);
    color: var(--efc-sub);
    white-space: nowrap;
    line-height: 18px;
  }
  .live {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
    background: var(--efc-ok);
    animation: ping 1.8s ease-out infinite;
  }
  .live.stale { background: var(--efc-sub); animation: none; opacity: 0.6; }
  @keyframes ping {
    0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--efc-ok) 60%, transparent); }
    100% { box-shadow: 0 0 0 6px transparent; }
  }

  /* ---------- tiles ---------- */
  .tile {
    background: var(--efc-surface);
    border-radius: var(--efc-tile-radius);
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    min-width: 0;
  }
  .lab {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.7px;
    color: var(--efc-sub);
    text-transform: uppercase;
    white-space: nowrap;
  }
  .lab ha-icon { --mdc-icon-size: 15px; }

  .body.wide { display: flex; gap: var(--efc-gap); align-items: stretch; }
  .side { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: var(--efc-gap); }
  .stack > * + * { margin-top: var(--efc-gap); }

  /* ---------- flow ---------- */
  .flow { padding: 6px; }
  .flow.wide { flex: 0 0 auto; }
  .canvas { position: relative; }
  .canvas svg { position: absolute; inset: 0; overflow: visible; }
  .track { fill: none; stroke: var(--efc-line); stroke-width: 7; stroke-linecap: round; }
  .fp {
    fill: none;
    stroke-linecap: round;
    stroke-dasharray: 0.1 10;
    animation: flow linear infinite;
    transition: stroke-width 0.5s, opacity 0.4s;
  }
  @keyframes flow { to { stroke-dashoffset: -20; } }
  .ring-bg { fill: none; stroke: var(--efc-line); }
  .seg { fill: none; stroke-linecap: round; transition: stroke-dasharray 0.6s, stroke-dashoffset 0.6s, opacity 0.4s; }
  .gauge { fill: none; stroke-linecap: round; transition: stroke-dasharray 0.8s, stroke 0.4s; }
  .t-sub { fill: var(--efc-sub); font-size: 10px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
  .t-val { fill: var(--efc-txt); font-size: 13.5px; font-weight: 600; }
  .t-big { fill: var(--efc-txt); font-size: 17px; font-weight: 700; }
  .t-today { fill: var(--efc-accent); font-size: 20px; font-weight: 700; }
  .t-unit { fill: var(--efc-sub); font-size: 10px; font-weight: 600; }

  .node {
    position: absolute;
    width: 29px;
    height: 29px;
    border-radius: 50%;
    border: 1.5px solid var(--c);
    color: var(--c);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    background: color-mix(in srgb, var(--c) 8%, transparent);
    cursor: pointer;
  }
  .node ha-icon { --mdc-icon-size: 16px; }
  .house {
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--efc-surface-hi);
    color: var(--efc-title);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .house ha-icon { --mdc-icon-size: 22px; }
  .meter-icon {
    position: absolute;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--efc-meter);
    cursor: pointer;
  }
  .meter-icon ha-icon { --mdc-icon-size: 17px; }
  .hit { position: absolute; cursor: pointer; }

  /* ---------- list (narrow, many consumers) ---------- */
  .list { padding: 6px 10px; }
  .lrow {
    display: grid;
    grid-template-columns: 18px minmax(0, 1.1fr) minmax(0, 1fr) 52px 48px;
    align-items: center;
    gap: 6px;
    padding: 3px 0;
    font-size: 12px;
    cursor: pointer;
  }
  .lrow.head { cursor: default; padding-bottom: 1px; }
  .lrow.head span { text-transform: uppercase; font-size: 9.5px; font-weight: 700; letter-spacing: 0.4px; color: var(--efc-sub); text-align: right; }
  .lrow ha-icon { --mdc-icon-size: 15px; color: var(--c); }
  .lname { font-size: 10px; font-weight: 700; letter-spacing: 0.4px; color: var(--efc-sub); text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .lbar { height: 4px; border-radius: 2px; background: var(--efc-line); overflow: hidden; }
  .lbar > span { display: block; height: 100%; background: var(--c); transition: width 0.5s; }
  .lw { text-align: right; font-weight: 600; }
  .le { text-align: right; font-weight: 600; color: var(--c); }

  /* ---------- small tiles (wide) ---------- */
  .stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--efc-gap); }
  .stat { padding: 8px 10px 11px; }
  .stat .v { text-align: right; font-size: 23px; font-weight: 600; line-height: 1; margin-top: 6px; white-space: nowrap; }
  .u { font-size: 0.5em; font-weight: 600; color: var(--efc-sub); margin-left: 2px; }
  .edge { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: var(--efc-line); }
  .edge > span { position: absolute; left: 0; top: 0; bottom: 0; transition: width 0.5s; }

  /* ---------- voltage ---------- */
  .volt { padding: 8px 10px 6px; display: flex; flex-direction: column; }
  .volt-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
  .vnow { display: flex; align-items: baseline; gap: 10px; white-space: nowrap; }
  .vnow b { font-size: 15px; font-weight: 700; }
  .vnow .n { font-size: 9.5px; font-weight: 700; letter-spacing: 0.4px; color: var(--efc-sub); margin-right: 3px; text-transform: uppercase; }
  .vnow .uu { font-size: 10px; color: var(--efc-sub); margin-left: 2px; }
  .chart { width: 100%; height: 40px; display: block; margin-top: 4px; flex: 1 1 auto; min-height: 36px; }
  .side .volt { flex: 1 1 auto; }
  .side .volt .chart { height: auto; }
  .volt-foot { display: flex; justify-content: space-between; font-size: 10px; font-weight: 600; color: var(--efc-sub); margin-top: 2px; }

  .warn { padding: 8px 4px; font-size: 13px; color: var(--efc-sub); }
`,Tt=new Set(["unavailable","unknown",""]),Nt=t=>"number"==typeof t?t:Date.parse(t);function Ht(t,e){const s=e?t.states[e]:void 0;if(!s||Tt.has(s.state))return;const i=parseFloat(s.state);return Number.isFinite(i)?i*Ft(s.attributes.unit_of_measurement):void 0}function Ft(t){switch((t??"W").trim()){case"kW":return 1e3;case"MW":return 1e6;case"mW":return.001;default:return 1}}function Dt(t){switch((t??"kWh").trim()){case"Wh":return.001;case"MWh":return 1e3;case"GWh":return 1e6;default:return 1}}function jt(t,e){const s=e?t.states[e]:void 0;if(!s||Tt.has(s.state))return;const i=parseFloat(s.state);return Number.isFinite(i)?i*Dt(s.attributes.unit_of_measurement):void 0}function Wt(t,e){const s=e?t.states[e]:void 0;if(!s||Tt.has(s.state))return;const i=parseFloat(s.state);return Number.isFinite(i)?i:void 0}function It(t,e=new Date){const s=t.config?.time_zone;if(!s){const t=new Date(e);return t.setHours(0,0,0,0),t}try{const t=new Intl.DateTimeFormat("en-US",{timeZone:s,hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).formatToParts(e),i=e=>Number(t.find(t=>t.type===e)?.value),o=Date.UTC(i("year"),i("month")-1,i("day"),i("hour"),i("minute"),i("second"))-1e3*Math.floor(e.getTime()/1e3);return new Date(Date.UTC(i("year"),i("month")-1,i("day"))-o)}catch{const t=new Date(e);return t.setHours(0,0,0,0),t}}async function Bt(t,e,s,i,o){if(!e.length)return{};try{return await t.callWS({type:"recorder/statistics_during_period",start_time:s.toISOString(),statistic_ids:e,period:"5minute",types:i,units:o})}catch(t){return console.warn("energy-flow-card: statistics unavailable",t),{}}}async function Lt(t,e,s,i){if(!e.length)return{};try{const i={type:"history/history_during_period",start_time:s.toISOString(),entity_ids:e,minimal_response:!0,no_attributes:!0,significant_changes_only:!1};return await t.callWS(i)}catch(t){return console.warn("energy-flow-card: history unavailable",t),{}}}function Vt(t,e=1){const s=[];for(const i of t??[]){const t=1e3*(i.lu??i.lc??0),o=parseFloat(i.s);t&&Number.isFinite(o)&&s.push([t,o*e])}return s}function qt(t){let e=0;for(let s=1;s<t.length;s++){const i=t[s][1]-t[s-1][1];e+=i>=0?i:t[s][1]}return e}function Gt(t,e,s){let i=0;for(let o=0;o<t.length;o++){const n=Math.max(t[o][0],e),r=Math.min(o+1<t.length?t[o+1][0]:s,s);r>n&&(i+=t[o][1]*(r-n)/36e8)}return i}async function Zt(t,e,s,i){const o=Date.now(),n=It(t,new Date(o)),r={},a=[...new Set([...s,...i])],[c,l]=await Promise.all([Bt(t,e,n,["change","state"],{energy:"kWh"}),Bt(t,a,n,["mean","max"],{power:"W"})]),h=[];for(const t of e){const e=c[t];if(!e?.length){h.push(t);continue}const s=e.reduce((t,e)=>t+(e.change??0),0),i=e[e.length-1].state;r[t]={kind:"counter",base:s,ref:i??void 0}}if(h.length){const e=await Lt(t,h,n);for(const s of h){const i=Dt(t.states[s]?.attributes.unit_of_measurement),o=Vt(e[s],i);r[s]=o.length?{kind:"counter",base:qt(o),ref:o[o.length-1][1]}:{kind:"counter",base:0,ref:jt(t,s)}}}let d=o;const p={};for(const t of s){const e=l[t]??[];let s=0;for(const t of e)null!=t.mean&&(s+=t.mean*(Nt(t.end)-Nt(t.start))/36e8);p[t]=s,e.length&&(d=Math.min(d,Nt(e[e.length-1].end)))}if(s.length){const e=s.filter(t=>!!l[t]?.length),i=s.filter(t=>!l[t]?.length),[a,c]=await Promise.all([e.length?Lt(t,e,new Date(d)):Promise.resolve({}),i.length?Lt(t,i,n):Promise.resolve({})]);for(const e of s){const s=Ft(t.states[e]?.attributes.unit_of_measurement),i=!!l[e]?.length,h=i?Nt(l[e][l[e].length-1].end):n.getTime(),d=Vt(i?a[e]:c[e],s),f=(p[e]??0)+Gt(d,h,o);r[e]={kind:"power",base:f,t:o,p:Ht(t,e)}}}let f;if(i.length){const t=new Map;for(const e of i)for(const s of l[e]??[]){if(null==s.max)continue;const e=Nt(s.start);t.set(e,(t.get(e)??0)+s.max)}for(const e of t.values())f=Math.max(f??0,e)}return{bases:r,peak:f}}function Jt(t,e,s){if(s){if("counter"===s.kind){const i=jt(t,e);return void 0===i||void 0===s.ref?s.base:s.base+(i>=s.ref?i-s.ref:i)}return s.base}}function Kt(t,e,s,i=Date.now()){"power"===s.kind&&(void 0!==s.p&&i>s.t&&(s.base+=s.p*(i-s.t)/36e8),s.t=i,s.p=Ht(t,e))}console.info("%c ENERGY-FLOW-CARD %c v0.1.2 ","color:#16243a;background:#4ecdc4;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px;","color:#4ecdc4;background:#16243a;font-weight:700;border-radius:0 4px 4px 0;padding:2px 6px;"),window.customCards=window.customCards||[],window.customCards.push({type:"energy-flow-card",name:"Energy Flow Card",description:"Responsive power-flow card: meters with voltage gauge, today's kWh computed by the card, consumers with live power and daily energy, voltage history.",preview:!0,documentationURL:"https://github.com/phateks/Energy-Flow-card"});const Yt=t=>{let e;for(const s of t)void 0!==s&&(e=(e??0)+s);return e},Qt=t=>void 0===t?"—":Math.abs(t)>=1e3?`${(t/1e3).toFixed(2)} kW`:`${Math.round(t)} W`,Xt=t=>void 0===t?"—":t<10?t.toFixed(2):t<100?t.toFixed(1):Math.round(t).toString();let te=class extends lt{constructor(){super(...arguments),this.width=0,this.rev=0,this.bases={},this.livePeak=0,this.vhist={},this.loading=!1,this.needsRefresh=!0}static async getConfigElement(){return await Promise.resolve().then(function(){return de}),document.createElement("energy-flow-card-editor")}static getStubConfig(t){const e=Object.values(t?.states??{}).filter(t=>t.entity_id.startsWith("sensor.")),s=t=>e.filter(e=>e.attributes.device_class===t).map(t=>t.entity_id),i=s("power"),o=s("voltage"),n=s("energy");return{type:"custom:energy-flow-card",title:xt,meters:[{name:"Grid",power:i[0],voltage:o[0],energy:n[0]}],consumers:i.slice(1,3).map(t=>({power:t}))}}setConfig(t){if(!t)throw new Error("Invalid configuration");if(t.meters&&!Array.isArray(t.meters))throw new Error("`meters` must be a list");if(t.consumers&&!Array.isArray(t.consumers))throw new Error("`consumers` must be a list");this.config={...t},this.bases={},this.vhist={},this.peakBase=void 0,this.livePeak=0,this.needsRefresh=!0}getCardSize(){return 5}getGridOptions(){return{columns:12,min_columns:6}}connectedCallback(){super.connectedCallback(),this.ro=new ResizeObserver(t=>{const e=Math.round(t[0]?.contentRect.width??0);e&&Math.abs(e-this.width)>=1&&(this.width=e)}),this.ro.observe(this),this.timer=window.setInterval(()=>this.refresh(),3e5),this.needsRefresh=!0}disconnectedCallback(){super.disconnectedCallback(),this.ro?.disconnect(),this.timer&&clearInterval(this.timer)}get meters(){return this.config?.meters??[]}get consumers(){return this.config?.consumers??[]}get labels(){return{...yt,...this.config?.labels??{}}}trackedEntities(){const t=[];for(const e of this.meters)t.push(...[e.power,e.voltage,e.current,e.energy].filter(Boolean));for(const e of this.consumers)t.push(...[e.power,e.energy].filter(Boolean));return t.push(...[this.config?.total_power,this.config?.total_energy].filter(Boolean)),t}darkMode(t){return t?.themes?.darkMode}shouldUpdate(t){if(t.has("config")||t.has("width")||t.has("rev"))return!0;const e=t.get("hass");return!e||!this.hass||(this.darkMode(e)!==this.darkMode(this.hass)||this.trackedEntities().some(t=>e.states[t]!==this.hass.states[t]))}willUpdate(t){if(this.hass&&this.config){if(t.has("hass")){this.toggleAttribute("light",!1===this.darkMode(this.hass));const t=Date.now();for(const[e,s]of Object.entries(this.bases))"power"===s.kind&&Kt(this.hass,e,s,t);this.appendVoltage(t);const e=It(this.hass).getTime();void 0!==this.day&&e!==this.day&&(this.needsRefresh=!0)}this.needsRefresh&&(this.needsRefresh=!1,setTimeout(()=>this.refresh(),0))}}firstUpdated(){this.width||(this.width=Math.round(this.getBoundingClientRect().width)||360)}appendVoltage(t){const e=this.config.voltage_hours??St;for(const s of this.meters){if(!s.voltage)continue;const i=Wt(this.hass,s.voltage);if(void 0===i)continue;const o=this.vhist[s.voltage]??=[],n=o[o.length-1];(!n||n[1]!==i||t-n[0]>3e4)&&o.push([t,i]);const r=t-36e5*e;for(;o.length>2&&o[1][0]<r;)o.shift()}}async refresh(){if(this.hass&&this.config&&!this.loading){this.loading=!0;try{const t=[],e=[],s={power:this.config.total_power,energy:this.config.total_energy};for(const i of[s,...this.meters,...this.consumers])i.energy?t.push(i.energy):i.power&&e.push(i.power);const i=this.meters.map(t=>t.power).filter(Boolean),o=s.power?[s.power]:i.length?i:this.consumers.map(t=>t.power).filter(Boolean),n=this.config.voltage_hours??St,r=this.meters.map(t=>t.voltage).filter(Boolean),[a,c]=await Promise.all([Zt(this.hass,[...new Set(t)],[...new Set(e)],o),Lt(this.hass,r,new Date(Date.now()-36e5*n))]);this.bases=a.bases;const l=It(this.hass).getTime();this.day!==l&&(this.livePeak=0),this.day=l,this.peakBase=a.peak;const h={};for(const t of r)h[t]=Vt(c[t]);this.vhist=h,this.appendVoltage(Date.now()),this.rev++}finally{this.loading=!1}}}moreInfo(t){t&&$t(this,"hass-more-info",{entityId:t})}friendly(t){return t?this.hass.states[t]?.attributes.friendly_name:void 0}model(){const t=this.hass,e=this.meters.map((e,s)=>({cfg:e,name:e.name??this.friendly(e.power??e.voltage??e.energy)??`Meter ${s+1}`,icon:e.icon??(0===s?"mdi:transmission-tower":"mdi:home-lightning-bolt-outline"),power:Ht(t,e.power),voltage:Wt(t,e.voltage),current:Wt(t,e.current),today:e.energy?Jt(t,e.energy,this.bases[e.energy]):e.power?Jt(t,e.power,this.bases[e.power]):void 0})),s=new Set([...this.meters.flatMap(t=>[t.power,t.energy]),this.config.total_power,this.config.total_energy].filter(Boolean)),i=this.consumers.filter(t=>!(t.power&&s.has(t.power)||t.energy&&s.has(t.energy))),o=i.map((e,s)=>{const i=e.power??e.energy;return{name:e.name??this.friendly(i)??`Load ${s+1}`,icon:e.icon??(i?t.states[i]?.attributes.icon:void 0)??"mdi:flash",color:e.color??Ut[s%Ut.length],power:Ht(t,e.power),today:e.energy?Jt(t,e.energy,this.bases[e.energy]):e.power?Jt(t,e.power,this.bases[e.power]):void 0,entity:i}}),n=this.config.total_power,r=this.config.total_energy,a=Ht(t,n),c=r?Jt(t,r,this.bases[r]):n?Jt(t,n,this.bases[n]):void 0,l=a??Yt(e.map(t=>t.power)),h=c??Yt(e.map(t=>t.today)),d=Yt(o.map(t=>t.power)),p=Yt(o.map(t=>t.today)),f=l??d,u=h??p,g=[...o];!1!==this.config.show_unmeasured&&o.length>0&&(void 0!==l||void 0!==h)&&g.push({name:this.config.unmeasured_name??bt,icon:"mdi:help-circle-outline",color:Ot,power:void 0!==l?Math.max(0,l-(d??0)):void 0,today:void 0!==h?Math.max(0,h-(p??0)):void 0});const m=e.map(t=>void 0!==t.current?t.current:void 0!==t.power&&t.voltage?t.power/t.voltage:void 0),v=Yt(m)??(void 0!==f&&e[0]?.voltage?f/e[0].voltage:void 0);void 0!==f&&(this.livePeak=Math.max(this.livePeak,f));return{meters:e,nodes:g,totalP:f,totalE:u,current:v,peak:Math.max(this.peakBase??0,this.livePeak)||void 0}}render(){if(!this.config||!this.hass)return G;const t=this.width||360,e=this.model(),s=t<480,i=t>=760,o=t-26,n=i?Math.round(.64*(o-7)):o,r=Math.max(3,this.config.max_flow_nodes??_t),a=s&&e.nodes.length>r,c=this.labels,l=L`
      <div class="header">
        <div class="title-icon"><ha-icon .icon=${this.config.icon??wt}></ha-icon></div>
        <div class="title-text">${this.config.title??xt}</div>
        ${e.meters.length>1?L`<span class="chip">Σ ${e.meters.length}</span>`:G}
        ${void 0!==e.current?L`<span class="chip">${e.current.toFixed(1)} A</span>`:G}
        <span class="live ${void 0===e.totalP?"stale":""}"></span>
      </div>
    `,h=this.renderFlow(e,n-12,s,a,r,c),d=a?this.renderList(e.nodes,c):G,p=this.renderVoltage(e.meters,c);if(i){const t=this.config.current_max??Ct;return L`<ha-card>
        ${l}
        <div class="body wide">
          <div class="tile flow wide" style="width:${n}px">${h}</div>
          <div class="side">
            <div class="stats">
              <div class="tile stat">
                <div class="lab"><ha-icon icon="mdi:sine-wave" style="color:var(--efc-meter)"></ha-icon>${c.current}</div>
                <div class="v">${void 0!==e.current?e.current.toFixed(1):"—"}<span class="u">A</span></div>
                <div class="edge">
                  <span style="width:${Math.min(100,(e.current??0)/t*100).toFixed(0)}%;background:var(--efc-meter)"></span>
                </div>
              </div>
              <div class="tile stat">
                <div class="lab"><ha-icon icon="mdi:trending-up" style="color:var(--efc-warn)"></ha-icon>${c.peak_today}</div>
                <div class="v">${void 0!==e.peak?(e.peak/1e3).toFixed(2):"—"}<span class="u">kW</span></div>
              </div>
            </div>
            ${p}
          </div>
        </div>
      </ha-card>`}return L`<ha-card>
      ${l}
      <div class="stack">
        <div class="tile flow">${h}</div>
        ${d}${p}
      </div>
    </ha-card>`}renderFlow(t,e,s,i,o,n){let r=t.nodes;if(i){const t=r.slice(o-2);r=[...r.slice(0,o-2),{name:n.rest,icon:"mdi:dots-horizontal",color:Ot,power:Yt(t.map(t=>t.power)),today:Yt(t.map(t=>t.today))}]}const a=r.length,c=!s&&a>7?2:1,l=Math.ceil(a/c),h=s?46:50,d=s?66:Math.max(96,Math.round(.18*e)),p=s?Math.min(170,Math.round(.56*e)):2===c?Math.round(.43*e):Math.round(.5*e),f=Math.round(.73*e),u=t.meters.length,g=t.meters.map((t,e)=>({x:26+44*e,y:26})),m=u?g[u-1].x+18+9:8,v=m+85>p-17?56:0,$=Math.max(l*h+(2===c?h/2:0)+16+v,172),y=Math.max(96,Math.round($/2-12)),x=(v+$)/2,w=r.map((t,e)=>{if(1===c)return{x:p,y:Math.round(x+(e-(a-1)/2)*h)};const s=e%2,i=Math.ceil(a/2),o=Math.floor(e/2);return{x:s?f:p,y:Math.round(x+(o-(i-1)/2)*h-h/4+(s?h/2:0))}}),b=this.config.idle_threshold??Pt,_=t=>{const e=t??0;return`opacity:${void 0!==t&&t>b?1:0};stroke-width:${(2+Math.min(4,e/500)).toFixed(1)}px;animation-duration:${Math.max(.25,1.6-e/1800).toFixed(2)}s`},k=2*Math.PI*18,A=this.config.voltage_min??kt,E=this.config.voltage_max??At,M=[],S=[];t.meters.forEach((t,e)=>{const s=g[e],i=d+16*(e-(u-1)/2),o=`M${s.x} ${s.y+18+3} C${s.x} ${y-48} ${i} ${y-58} ${i} ${y-34}`;S.push(V`<path class="track" d=${o}></path>`),M.push(V`<path class="fp" d=${o} stroke=${"#8fb3ff"} style=${_(t.power)}></path>`);const n=void 0===t.voltage?0:Math.max(0,Math.min(1,(t.voltage-Et)/(Mt-Et))),r=void 0===t.voltage||t.voltage>=A&&t.voltage<=E;M.push(V`
        <circle class="ring-bg" cx=${s.x} cy=${s.y} r=${18} stroke-width="4"
          stroke-dasharray="${(.75*k).toFixed(1)} ${k.toFixed(1)}" stroke-linecap="round"
          transform="rotate(135 ${s.x} ${s.y})"></circle>
        <circle class="gauge" cx=${s.x} cy=${s.y} r=${18} stroke-width="4"
          stroke=${r?"var(--efc-ok)":"var(--efc-warn)"}
          stroke-dasharray="${(.75*k*n).toFixed(1)} ${k.toFixed(1)}"
          transform="rotate(135 ${s.x} ${s.y})"></circle>`)});const C=this.config.total_energy??this.config.total_power??t.meters.find(t=>t.cfg.energy)?.cfg.energy??t.meters[0]?.cfg.power,P=Yt(r.map(t=>t.power))??0,U=2*Math.PI*30;let O=0;const z=[],R=[],T=[];return r.forEach((t,e)=>{const s=w[e],i=d+34,o=s.x-17,n=s.x===f&&2===c?p-26:o,r=(i+n)/2,a=n===o?`M${i} ${y} C${r} ${y} ${r} ${s.y} ${o} ${s.y}`:`M${i} ${y} C${r} ${y} ${r} ${s.y} ${n} ${s.y} L${o} ${s.y}`;R.push(V`<path class="track" d=${a}></path>`),T.push(V`<path class="fp" d=${a} stroke=${t.color} style=${_(t.power)}></path>
        <text class="t-sub" x=${s.x+22} y=${s.y-4}>${t.name}</text>
        <text x=${s.x+22} y=${s.y+12}
          ><tspan class="t-val">${Qt(t.power)}</tspan
          >${void 0!==t.today?V`<tspan dx="6" style="fill:${t.color===Ot?"var(--efc-sub)":t.color};font-size:11px;font-weight:600">${Xt(t.today)} kWh</tspan>`:G}</text
        >`);const l=P>0?(t.power??0)/P:0;z.push(V`<circle class="seg" cx=${d} cy=${y} r="30" stroke-width="6" stroke=${t.color}
        stroke-dasharray="${Math.max(0,U*l-7).toFixed(1)} ${U.toFixed(1)}"
        stroke-dashoffset="${(-O-3.5).toFixed(1)}"
        style="opacity:${l>.02?1:0}"></circle>`),O+=U*l}),L`
      <div class="canvas" style="width:${e}px;height:${$}px">
        <svg width=${e} height=${$} viewBox="0 0 ${e} ${$}">
          ${S}${R}${M}${T}
          <text class="t-sub" x=${m} y="17">${n.today}</text>
          <text x=${m} y="38"
            ><tspan class="t-today">${Xt(t.totalE)}</tspan><tspan class="t-unit" dx="3">kWh</tspan></text
          >
          <circle class="ring-bg" cx=${d} cy=${y} r="30" stroke-width="6"></circle>
          <g transform="rotate(-90 ${d} ${y})">${z}</g>
          <text class="t-big" x=${d} y=${y+52} text-anchor="middle">${Qt(t.totalP)}</text>
          <text class="t-sub" x=${d} y=${y+66} text-anchor="middle">${n.now}</text>
        </svg>
        ${t.meters.map((t,e)=>L`<div
            class="meter-icon"
            title=${t.name}
            style="left:${g[e].x-18}px;top:${g[e].y-18}px"
            @click=${()=>this.moreInfo(t.cfg.power??t.cfg.voltage??t.cfg.energy)}
          >
            <ha-icon .icon=${t.icon}></ha-icon>
          </div>`)}
        <div class="hit" style="left:${m}px;top:4px;width:110px;height:40px" @click=${()=>this.moreInfo(C)}></div>
        <div class="house" style="left:${d-20}px;top:${y-20}px"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon></div>
        ${r.map((t,s)=>L`<div
              class="node"
              title=${t.name}
              style="--c:${t.color};left:${w[s].x-14.5}px;top:${w[s].y-14.5}px"
              @click=${()=>this.moreInfo(t.entity)}
            >
              <ha-icon .icon=${t.icon}></ha-icon>
            </div>
            <div
              class="hit"
              style="left:${w[s].x+18}px;top:${w[s].y-16}px;width:${Math.max(40,e-w[s].x-18)}px;height:32px"
              @click=${()=>this.moreInfo(t.entity)}
            ></div>`)}
      </div>
    `}renderList(t,e){const s=t.some(t=>void 0!==t.today),i=Yt(t.map(t=>s?t.today:t.power))??0;return L`<div class="tile list">
      <div class="lrow head"><span></span><span></span><span></span><span>${e.now}</span><span>${e.today}</span></div>
      ${t.map(t=>{const e=(s?t.today:t.power)??0;return L`<div class="lrow" style="--c:${t.color}" @click=${()=>this.moreInfo(t.entity)}>
          <ha-icon .icon=${t.icon}></ha-icon>
          <span class="lname">${t.name}</span>
          <span class="lbar"><span style="width:${i>0?(e/i*100).toFixed(1):0}%"></span></span>
          <span class="lw">${Qt(t.power)}</span>
          <span class="le" style=${t.color===Ot?"color:var(--efc-sub)":""}>${Xt(t.today)}</span>
        </div>`})}
    </div>`}renderVoltage(t,e){const s=t.filter(t=>t.cfg.voltage);if(!s.length)return G;const i=this.config.voltage_hours??St,o=Date.now(),n=o-36e5*i,r=s.map(t=>this.downsample((this.vhist[t.cfg.voltage]??[]).filter(t=>t[0]>=n-6e4),n,o)),a=r.flat().map(t=>t[1]),c=a.length?Math.min(...a):void 0,l=a.length?Math.max(...a):void 0;let h=c??226,d=l??234;if(d-h<6){const t=(h+d)/2;h=t-3,d=t+3}const p=.12*(d-h);h-=p,d+=p;const f=t=>(40-(t-h)/(d-h)*40).toFixed(1),u=[230,this.config.voltage_min??kt,this.config.voltage_max??At].filter(t=>t>h&&t<d),g=i>=1?`${i%1?i.toFixed(1):i}h`:`${Math.round(60*i)}min`;return L`<div class="tile volt">
      <div class="volt-head">
        <span class="lab"><ha-icon icon="mdi:sine-wave" style="color:var(--efc-ok)"></ha-icon>${e.voltage}</span>
        <span class="vnow">
          ${s.map((t,e)=>L`<span style="color:${zt[e%zt.length]};cursor:pointer"
              @click=${()=>this.moreInfo(t.cfg.voltage)}
              >${s.length>1?L`<span class="n">${t.name}</span>`:G}<b
                >${void 0!==t.voltage?t.voltage.toFixed(1):"—"}</b
              ><span class="uu">V</span></span
            >`)}
        </span>
      </div>
      <svg class="chart" viewBox="0 0 300 40" preserveAspectRatio="none">
        ${u.map(t=>V`<line x1="0" x2="300" y1=${f(t)} y2=${f(t)} stroke="var(--efc-line)" stroke-width="1"
            stroke-dasharray="3 4" vector-effect="non-scaling-stroke"></line>`)}
        ${r.map((t,e)=>V`<polyline fill="none" stroke=${zt[e%zt.length]} stroke-width="1.6"
            stroke-linejoin="round" vector-effect="non-scaling-stroke"
            points=${t.map(t=>`${(t=>((t-n)/(o-n)*300).toFixed(1))(t[0])},${f(t[1])}`).join(" ")}></polyline>`)}
      </svg>
      <div class="volt-foot">
        <span>${e.window.replace("{h}",g)}</span>
        <span>${void 0!==c?`min ${c.toFixed(1)} · max ${l.toFixed(1)} V`:""}</span>
      </div>
    </div>`}downsample(t,e,s){if(t.length<=120)return t.map(([t,s])=>[Math.max(t,e),s]);const i=(s-e)/120,o=[];let n=0;for(let s=0;s<120;s++){const r=e+(s+1)*i;let a=0,c=0;for(;n<t.length&&t[n][0]<r;)a+=t[n][1],c++,n++;c&&o.push([e+(s+.5)*i,a/c])}return o}};te.styles=Rt,t([ut({attribute:!1})],te.prototype,"hass",void 0),t([gt()],te.prototype,"config",void 0),t([gt()],te.prototype,"width",void 0),t([gt()],te.prototype,"rev",void 0),te=t([dt("energy-flow-card")],te);const ee=(t,e)=>({name:t,selector:{entity:e?{domain:"sensor",device_class:e}:{domain:"sensor"}}}),se=t=>({name:t,selector:{text:{}}}),ie=(t,e=1)=>({name:t,selector:{number:{mode:"box",step:e}}}),oe=t=>({type:"grid",name:"",schema:t}),ne=[oe([se("title"),{name:"icon",selector:{icon:{}}}]),ee("total_power","power"),ee("total_energy","energy"),oe([{name:"show_unmeasured",selector:{boolean:{}}},se("unmeasured_name")]),oe([ie("max_flow_nodes"),ie("voltage_hours",.5)]),oe([ie("voltage_min"),ie("voltage_max")]),oe([ie("current_max"),ie("idle_threshold")])],re=[oe([se("name"),{name:"icon",selector:{icon:{}}}]),ee("power","power"),ee("energy","energy"),ee("voltage","voltage"),ee("current","current")],ae=[oe([se("name"),{name:"icon",selector:{icon:{}}}]),ee("power","power"),ee("energy","energy"),se("color")],ce={title:"Title",icon:"Icon",total_power:"House total power sensor (optional – read as is, not summed)",total_energy:"House total energy sensor (optional – preferred for Today)",show_unmeasured:"Show unmeasured (meters − consumers)",unmeasured_name:"Unmeasured name",max_flow_nodes:`Phone: max nodes before grouping (default ${_t})`,voltage_hours:`Voltage chart window, hours (default ${St})`,voltage_min:`Normal voltage from (default ${kt} V)`,voltage_max:`Normal voltage to (default ${At} V)`,current_max:`Current bar full scale (default ${Ct} A)`,idle_threshold:`Idle below (default ${Pt} W)`,name:"Name",power:"Power sensor (W / kW)",energy:"Energy sensor (kWh, optional – preferred for Today)",voltage:"Voltage sensor (V)",current:"Current sensor (A, optional)",color:"Color (optional, e.g. #4ecdc4)"},le=t=>{const e={...t};for(const t of Object.keys(e))""!==e[t]&&void 0!==e[t]&&null!==e[t]||delete e[t];return e};let he=class extends lt{constructor(){super(...arguments),this._label=t=>ce[t.name]??t.name}setConfig(t){this._config=t}render(){if(!this.hass||!this._config)return G;const t=this._config.meters??[],e=this._config.consumers??[];return L`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${ne}
        .computeLabel=${this._label}
        @value-changed=${this._mainChanged}
      ></ha-form>

      <div class="section">Meters</div>
      ${t.map((t,e)=>this._item("meters",e,t,re,t.name||t.power||`Meter ${e+1}`))}
      <button class="add" @click=${()=>this._add("meters")}>+ Add meter</button>

      <div class="section">Consumers</div>
      ${e.map((t,e)=>this._item("consumers",e,t,ae,t.name||t.power||t.energy||`Consumer ${e+1}`))}
      <button class="add" @click=${()=>this._add("consumers")}>+ Add consumer</button>
    `}_item(t,e,s,i,o){const n=this._config[t]??[];return L`<ha-expansion-panel outlined .header=${o}>
      <ha-form
        .hass=${this.hass}
        .data=${s}
        .schema=${i}
        .computeLabel=${this._label}
        @value-changed=${s=>this._itemChanged(t,e,s)}
      ></ha-form>
      <div class="row">
        <button ?disabled=${0===e} @click=${()=>this._move(t,e,-1)}>↑</button>
        <button ?disabled=${e===n.length-1} @click=${()=>this._move(t,e,1)}>↓</button>
        <button class="del" @click=${()=>this._remove(t,e)}>Remove</button>
      </div>
    </ha-expansion-panel>`}_emit(t){this._config=t,$t(this,"config-changed",{config:t})}_mainChanged(t){t.stopPropagation();const e=le(t.detail.value);this._emit({...e,meters:this._config.meters,consumers:this._config.consumers})}_itemChanged(t,e,s){s.stopPropagation();const i=[...this._config[t]??[]];i[e]=le(s.detail.value),this._emit({...this._config,[t]:i})}_add(t){this._emit({...this._config,[t]:[...this._config[t]??[],{}]})}_remove(t,e){const s=[...this._config[t]??[]];s.splice(e,1),this._emit({...this._config,[t]:s})}_move(t,e,s){const i=[...this._config[t]??[]],o=e+s;o<0||o>=i.length||([i[e],i[o]]=[i[o],i[e]],this._emit({...this._config,[t]:i}))}};he.styles=r`
    .section {
      margin: 18px 0 6px;
      font-weight: 600;
      font-size: 15px;
    }
    ha-expansion-panel {
      display: block;
      margin-bottom: 8px;
      --expansion-panel-content-padding: 8px 12px;
    }
    .row {
      display: flex;
      gap: 6px;
      justify-content: flex-end;
      margin-top: 8px;
    }
    button {
      font: inherit;
      font-size: 13px;
      padding: 4px 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    button.del {
      color: var(--error-color, #db4437);
    }
    button.add {
      width: 100%;
      padding: 8px;
      border-style: dashed;
    }
  `,t([ut({attribute:!1})],he.prototype,"hass",void 0),t([gt()],he.prototype,"_config",void 0),he=t([dt("energy-flow-card-editor")],he);var de=Object.freeze({__proto__:null,get EnergyFlowCardEditor(){return he}});export{te as EnergyFlowCard};
