authrouter

-POST/signup
-POST/login
-POST/logout

profilerouter

-GET/Profile/view
-POST/Profile/edit
-POST/Profile/password

connectionrequestrouter

-POST/request/send/intereted/:userid
=POST/request/sned/ignored/:userid
-POST/request/review/accept/:requestid
-POST/request/revew/rejected/:requestid

userRouter

-POST/user/connections
-GET/user/request
-GEt/user/feed

status ; ignore , intersetd ,acceptd ,rejected
