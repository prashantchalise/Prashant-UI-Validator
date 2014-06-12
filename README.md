<div class="col-xs-12 col-sm-6 col-lg-8">
<h2>Prashant-UI-Validator is a UI-Validator library that can be used with almost all the HTML controls. Initially designed for ASP.net MVC, it was later generalized to support all the controls.</h2>
<ul>
	<li>
<h3>Step 1:</h3>

<hr />

Include the UI Validator JS file, Jquery &amp; Bootstrap CSS files. For bootstrap CSS file &amp; Jquery file, you can use the CDN as shown in the example below
<div class="highlight">
<pre><code class="html">
&lt;!-- CDN --&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"&gt;&lt;/script&gt;
&lt;link rel="stylesheet" media="screen" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css"&gt;
&lt;!-- END OF CDN --&gt;
&lt;script type="text/javascript" src="js/prashant-ui-validator-1.4.js"&gt;&lt;/script&gt;
	  </code>
</pre>
</div></li>
	<li>
<h3>Step 2:</h3>

<hr />

Create required form and add the following keywords along with appropriate values.
<div class="highlight">
<pre><code>

&lt;!-- INCLUDE FORM WITH 'Group'--&gt;

&lt;form Group='formGroup'&gt;

&lt;!-- ADD MSG DIV FOR DISPLAYING MESSAGE --&gt;
&lt;div id="divMsg"&gt;&lt;/div&gt;
......
&lt;!-- ADD PROPER TYPE --&gt;
&lt;input type="text" /&gt;

&lt;!-- MESSAGE IS OPTIONAL--&gt;
&lt;input type="text" /&gt;

&lt;!-- EVEN TYPE IS OPTIONAL--&gt;
&lt;input type="text" /&gt;
....

&lt;/form&gt;	  

	  </code></pre>
</div></li>
	<li>
<h3>Step 3:</h3>

<hr />

Verify if <b><i>prashant-ui-validator-x.x.js</i></b> is included inside the application. Add the proper calling function inside page load event as shown below.
<div class="highlight">
<pre><code class="html">
x.Validate(Button_Object, Group_Name, Message_Container_Element,Show_Loader,Post_Function_Call_After_Valid_Result);
Where</code></pre>
<ul>
<ul>
	<li><b>Button_Object =</b> button for click event.</li>
</ul>
</ul>
&nbsp;

</div></li>
	<li><b>Group_Name (Optional as can be replaced using null value )=</b> Form group name declared using Group = "Group_Name" inside root div.</li>
	<li><b>Message_Container_Element =</b> Element for displaying the validation message.</li>
	<li><b>Show_Loader =</b> Boolean value used for show/hide loader.</li>
	<li><b>Post_Function_Call_After_Valid_Result =</b> Function in string form. This function is evaluated immediately after validation returns a valid result.</li>
	<li>
<div class="highlight">

&nbsp;

<b> eg. </b> x.Validate($('#btn'),'my_Group',$('#divMsg'),true,"alert('This is valid one!');");

</div></li>
	<li>
<h3>Step 4:</h3>

<hr />

Congratulations ! there is no step 4 and validation is ready to go !

Though,it isn't compulsary, but before you start, We highly recommend you to modify few of the variables inside UI validator JS file before you continue.
