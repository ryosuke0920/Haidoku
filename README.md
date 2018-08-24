# Search Dictionary Faster
## Public distribution
### Firefox Add-ons
https://addons.mozilla.org/en-US/firefox/addon/lesslaborgotodictionary/
### chrome web store
https://chrome.google.com/webstore/detail/search-dictionary-faster/oagfpnomdjhbokfdhndphgepbbcbkbdf

## Summary
When I read a foreign language web site, it's boring to search  word I don't know. I made this tool to search smoothly. Select text, it's displayed that the meaning and some links to search the text. There is also a function to support word review.

## Description
### Link list
When you select a text, Link list is displayed. Link list is list of your favorite dictionary sites. If you click the link, you can move to that site immediately and view the search results, so there is no work of copying or opening the site with new tabs. When ESC key is pressed or mouse is clicked outside the area of Link list, Link list is closed. You can change Link list to small icon button, also change display mode to automatic or manual.

### Context menu(right click)
Link list is also displayed in the context menu. So you can use without changing your experience. And you can change display mode to automatic or manual in here.

### Wiktionary linkage
Wiktionary is a dictionary site made by volunteer. When you select a text, The text is searched by Wiktinary and the description is displayed.

### Make Link list
On the Setting screen you have to make your Link list. Generaly you have to find out URLs and search parameters, but I already found out major site URLs and search parameters. It's prepared in this tool. So you can use this tool immediately.

### History
On the Setting screen you can watch history. A word with a high number of searches is that your understanding is not sufficient although it is used frequently. You should study it intensively. To find the word efficiently, a function is built in to aggregate search counts.

### About preset URLs
URLs and search parameters of the following sites are prepared. If these specifications are changed by the site administrator, we need to change too. If you want to add some URLs, please email me. There may be people who need it too.

* Google (Image, Videos, Translate)
* Bing (Image, Videos)
* DuckDuckGo (Image, Videos)
* Ecosia (Image, Videos)
* 百度
* Wikipedia, Wiktionary
* Cambridge Dictionary
* Oxford Dictionaries
* Collins
* weblio 辞書
* goo 辞書
* yahoo 辞書
* 英辞郎 on the WEB
* You Tube, Dailymotion
* Facebook, Twitter

etc. Total 97 URLs.

## Release note
Release note is posted on GitHub.  
https://github.com/ryosuke0920/Search-Dictionary-Faster/releases  

Release is announced on Twitter.  
https://twitter.com/SearchDictionar

## About how data used.
Setting data is sent by the synchronization service provided by the browser. History data is out of the synchronization service.  
When click a link or execute wiktionary linkage, it sends basic internet information (IP address, Cookie, etc) and the text selected. HTTP REFER (Information on which site it came from) is excluded.  
As needed download favicon images and save it.  
Any other data are not collected and not sent.  

## Contact
Please use GitHub Issues to report a bug, to request, to contact, etc. Writing is open to the public.  
https://github.com/ryosuke0920/Search-Dictionary-Faster/issues  

Also receive by email.  
ryosuke.ohta.programmer@gmail.com  
Freelance programmer, Ryosuke Ohta  

## License
This software is released under the MIT License.  
https://opensource.org/licenses/MIT
