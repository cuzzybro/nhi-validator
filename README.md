## Nhi Validator

### required:
- Node v18.18.1 or later installed
- Git

### starting the project:
- Clone the project to local directory
- Run command from cmd or terminal to install dependencies
``` cmd
npm install
```
- Run command to start express server
``` cmd
node run startServer
```

API runs on port 5000. Can access in the browser locally on either http://localhost:5000 or http://127.0.0.1:5000

Open swagger documentation at http://localhost:5000/api-docs

Available api endpoints
- [GET] /api/get-nhi 
- [POST] /api/isNhiValid (See swagger api-docs)

### Based on MOH Routine 
## NHI Validation Routine
The National Health Index (NHI) number is used by many national and local systems to provide a safe and secure reference key for patient data. Because of its importance, the NHI number has a built-in validation routine that has been designed to allow systems to minimise typographical errors as NHI numbers are keyed in. In April 2023 a new NHI format was introduced. New format NHIs will not be issued to patients before October 2025 to give providers time to change their systems to accept the new format.<br>
#### NHI number structure
The NHI number is a unique 7-character identifier.  It may have one of 2 formats <br><br>
3 alphabetical characters followed by 4 numeric characters, the last character is a check digit <br> 
<b>OR</b> <br>
3 alphabetical characters followed by 2 numeric characters and lastly 2 alphabetical characters, the last character is an alphabetic check digit.<br>

| Format 1 | AAANNNC |
|----|----|
| Where: | A is an alphabet character, but not ‘I’ or ‘O’ |
|| N is a number |
|| C is a number, which is also the check digit |
<br>

| Format 2 | AAANNAC |
|----|----|
| Where: | A is an alphabet character, but not ‘I’ or ‘O’ |
|| N is a number |
|| C is an alphabet character, which is also the check digit |
<br>

### Alphabet Conversion Table
Each alphabet character is assigned a number based on the following table:<br>
|||||||||
|----|----|----|----|----|----|----|----|
|A|1||J|9||S|17|
|B|2||K|10||T|18|
|C|3||L|11||U|19|
|D|4||M|12||V|20|
|E|5||N|13||W|21|
|F|6||P|14||X|22|
|G|7||Q|15||Y|23|
|H|8||R|16||Z|24|
<br>

### Validation Steps:
|Step|Description|Example: ZZZ0016|Example: ZZZ0024|Example: ZZZ0044|Example: ZZZ00AC|Example: ZVU27KE|					
|----|----|----|----|----|----|----|
|1|The first, second and third characters must be within the Alphabet Conversion Table. They cannot be ‘I’ or ‘O’. (see above)|ZZZ|ZZZ|ZZZ|ZZZ|ZVU|
|2|The fourth and fifth characters must be numeric|00|00|00|00|27|
|3|The sixth and seventh characters are either both numeric or both alphabetic|16|24|44|AC|KE|
|4|Assign first letter its corresponding value from the Alphabet Conversion Table and multiply value by 7.|24*7=168|24*7=168|24*7=168|24*7=168|24*7=168|
|5|Assign second letter its corresponding value from the Alphabet Conversion Table and multiply value by 6.|24*6=144|24*6=144|24*6=144|24*6=144|20*6=120|
|6|Assign third letter its corresponding value from the Alphabet Conversion Table and multiply value by 5.|24*5=120|24*5=120|24*5=120|24*5=120|19*5=95|
|7|Multiply first number by 4|0*4=0|0*4=0|0*4=0|0*4=0|2*4=8|
|8|Multiply second number by 3.|0*3=0|0*3=0|0*3=0|0*3=0|7*3=21|
|9|If the sixth character is a number then multiply that number by 2|1*2=2|2*2=4|4*2=8|||
||If the sixth character is an alpha character assign its corresponding value from the Alphabet Conversion Table and multiply value by 2.||||A=1 1*2=2|K=10	10*2=20|
|10|Total the results of steps 4 to 9.|168+144+120 +0+0+2 = 434|168+144+120 +0+0+4 = 436|168+144+120 +0+0+8 = 440|168+144+120 +0+0+2= 434|168+120+95+8+21+20=432|
|11|If the NHI number is of the old format Then divide by 11 and make note of the remainder*|434/11=39 r 5|436/11=39 r 7|440/11=40 r 0|||	 	 
||If the NHI number is of the new format Then divide by 23 and make note of the remainder**||||434/23=18 r 20|432/23= 18 r 18| 
|12|If the NHI number is of the old formant Then subtract the remainder from 11 to find the check digit. If the check digit is ‘11’ then the NHI number is invalid.|11-5 = 6|11-7 = 4|11-0=11 check digit is invalid|Continue to step 14|Continue to step 14|
|13|If the check digit equals ‘10’, convert to ‘0’.|Continue to step 15|Continue to step 15|Continue to step 15.|||	 	 
|14|If the NHI number is of the new format then subtract the remainder from 23 and use the conversion table to create alpha check digit.||||23-20 = 3 3 = C|23-18=5 5 = E|
|15|The last character must equal the check digit.|6 = 6|4 = 4|11 can’t be expressed as a single digit|C = C|E = E|
|16|NHI number passes the NHI validation routine.|Yes|Yes|No***|Yes|Yes|
<br>

\* Excel has a modulus function MOD (n,d) where n is the number to be converted (eg, the sum calculated in step 9), and d equals the modulus (in the case of the NHI this is 11).<br>
\*\*  In Java/C#/javascript/etc , this is the (mod) % operator.<br>
\*\*\*Note: no digit can be added to the end of ZZZ004 to create a valid NHI number.<br><br>
This validation routine allows health and disability support services to confirm that the NHI is in the correct format and that it is a valid NHI number. Its main purpose is to identify mistyped NHI numbers. <br><br>
The validation routine does not confirm that a health and disability support services has assigned the NHI number to a correct individual. Nor does it mean the NHI number has been registered on the NHI. For example, pre-allocated NHI numbers are not ‘active’ until they have been sent to the NHI in the registration transaction (NEWHCU). 
