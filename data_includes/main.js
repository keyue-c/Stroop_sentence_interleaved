PennController.ResetPrefix(null) // Shorten command names (keep this line here)

// Show the 'intro' trial first, then all the 'experiment' trials in a random order
// then send the results and finally show the trial labeled 'bye'
Sequence( "intro", "practice_color", randomize("color_matching"), "end_color_matching", "practice_stroop", randomize("stroop"), 
            "practice_combined", randomize("practice"), "exp_instru", randomize("block1"), "break", randomize("block2"), SendResults(), "bye" )


// What is in Header happens at the beginning of every single trial
Header(
    // We will use this global Var element later to store the participant's name
    newVar("ID")
        .global()
    ,
    // Delay of 250ms before every trial
    newTimer(250)
        .start()
        .wait()
    ,
    newVar("score_matching",0)
        .global()
    ,
    newVar("score_stroop",0)
        .global()
    ,
    newImage("fixation", "FIXATION.bmp")
        .size(35,35)
)
.log( "ID" , getVar("ID") )
// This log command adds a column reporting the participant's name to every line saved to the results

// Part1 information and consent
newTrial( "intro" ,
    newHtml("intro", "intro.html")
        .print()
    ,
    newButton("Click and scroll down to continue")
        .print()
        .wait()
    ,
    newHtml("consent","consent.html")
        .print()
    ,
    newButton("Click and scroll down to continue")
        .print()
        .wait(
            getHtml("consent").test.complete()
                .failure(getHtml("consent").warn()))
    ,
    newHtml("demographic", "demographic.html")
        .log()
        .print()
    ,
    newButton("I've completed the form")
        .print()
        .wait(
            getHtml("demographic").test.complete()
                .failure(getHtml("demographic").warn()))
    ,
    newText("<br/><br/><br/><p><b>Almost there!</b></p><p>Please enter your <b>Proliphic ID</b> below and press Enter:</p>")
        .print()
    ,
    newTextInput("")
        .print()
        .wait()                 // The next command won't be executed until Enter is pressed
        .setVar( "ID" )
    ,
    newButton("Start")
        .print()
        .wait()
        // This setVar command stores the value from the TextInput element into the Var element
)

// Part2 practice trials: color matching
newTrial("practice_color",
    newHtml("prac_col", "prac_instru1.html")
        .print()
    ,
    newKey(" ")
        .wait()
)

Template( "practice_matching_ibex.csv",
    row => newTrial("color_matching",
                getVar("score_matching")
                    .test.is(6).failure(// fixation test
                                    getImage("fixation")
                                        .print("center at 50%", "middle at 37.5%")
                                    ,
                                    newTimer(300)
                                        .start()
                                        .wait()
                                    ,
                                    getImage("fixation")
                                        .remove()
                                    ,
                                    newTimer(200)
                                        .start()
                                        .wait()
                                    , // show color patch
                                    newText("color_patch", "▪")
                                        .color(row.FontColourCode)
                                        .css("font-size", "10em")
                                        .print("center at 50%", "middle at 37.5%")
                                    ,
                                    newTimer("delay", 1000)
                                        .start()
                                    , //timer.stop will stop timer and will not continue it again
                                    newKey("re_color", 49, 50, 51)
                                        .callback(getTimer("delay").stop())
                                    ,
                                    getTimer("delay")
                                        .wait()
                                    ,
                                    getText("color_patch")
                                        .remove()
                                    ,
                                    getKey("re_color")
                                        .test.pressed(row.Button)
                                            .success(getVar("score_matching").set(v=>v+1),
                                                    newText("correct","<br/><br/><br/><br/>CORRECT!")
                                                        .print("center at 50%", "middle at 35%"),
                                                    newText("display_score", "")
                                                        .text(getVar("score_matching"))
                                                        .before(newText("left label", "You've got &nbsp;"))
                                                        .after(newText("right label", "&nbsp; correct"))
                                                        .print("center at 45%", "middle at 45%"))
                                            .failure(newText("incorrect","<br/><br/><br/><br/>INCORRECT!")
                                                        .color("red")
                                                        .print("center at 50%", "middle at 35%"),
                                                    newText("display_score", "")
                                                        .text(getVar("score_matching"))
                                                        .before(newText("left label", "You've got &nbsp;"))
                                                        .after(newText("right label", "&nbsp; correct"))
                                                        .print("center at 45%", "middle at 45%"))
                                    ,
                                    newTimer(1000)
                                        .start()
                                        .wait()
                                )
        )
)


// Part3 Practice trials: stroop
newTrial("practice_stroop",
    newText("<p>Then we'll print colour names in different inks.</p>")
        .css("font-size", "1.5em")
        .print()
    ,
    newText("<p><b>Remember:</b></p><p>Press butten <b>\"1\"</b> when ink is <b>blue</b></p><p>Press butten <b>\"2\"</b> when ink is <b>green</b></p><p>Press butten <b>\"3\"</b> when ink is <b>yellow</b></p><p>Press <b>space bar</b> to start practice.</p>")
        .css("font-size", "1.2em")
        .print()
    ,
    newText("<p><b>You must get 10 trails correct to proceed to the next step.</b></p>")
        .css("font-size", "1.2em")
        .color("red")
        .print()
    ,
    newKey(" ")
        .wait()
)

Template( "practice_stroop_ibex.csv",
    row => newTrial("stroop",
                getVar("score_stroop")
                    .test.is(10).failure(// fixation scross
                                    getImage("fixation")
                                        .print("center at 50%", "middle at 37.5%")
                                    ,
                                    newTimer(300)
                                        .start()
                                        .wait()
                                    ,
                                    getImage("fixation")
                                        .remove()
                                    ,
                                    newTimer(200)
                                        .start()
                                        .wait()
                                    , // show stroop word
                                    newText("stroop_word", row.Word)
                                        .color(row.FontColourCode)
                                        .css("font-size", "1.5em")
                                        .print("center at 50%", "middle at 37.5%")
                                    ,
                                    newTimer("delay", 1000)
                                        .start()
                                    , //timer.stop will stop timer and will not continue it again
                                    newKey("re_stroop", 49, 50, 51)
                                        .callback(getTimer("delay").stop())
                                    ,
                                    getTimer("delay")
                                        .wait()
                                    ,
                                    getText("stroop_word")
                                        .remove()
                                    ,
                                    getKey("re_stroop")
                                        .test.pressed(row.Button)
                                            .success(getVar("score_stroop").set(v=>v+1),
                                                    newText("correct","<br/><br/><br/><br/>CORRECT!")
                                                        .print("center at 50%", "middle at 35%"),
                                                    newText("display_score", "")
                                                        .text(getVar("score_stroop"))
                                                        .before(newText("left label", "You've got &nbsp;"))
                                                        .after(newText("right label", "&nbsp; correct"))
                                                        .print("center at 45%", "middle at 45%"))
                                            .failure(newText("incorrect","<br/><br/><br/><br/>INCORRECT!")
                                                        .color("red")
                                                        .print("center at 50%", "middle at 35%"),
                                                    newText("display_score", "")
                                                        .text(getVar("score_stroop"))
                                                        .before(newText("left label", "You've got &nbsp;"))
                                                        .after(newText("right label", "&nbsp; correct"))
                                                        .print("center at 45%", "middle at 45%"))
                                    ,
                                    newTimer(1000)
                                        .start()
                                        .wait()
                                )
        )
)

// Part4 Practice trials: practice combined
newTrial("practice_combined",
    newText("<p>Now we'll combine colour matching with some reading.</p>")
        .css("font-size", "1.2em")
        .print()
    ,
    newHtml("prac_reading", "prac_instru2.html")
        .print()
    ,
    newKey(" ")
        .wait()
)

Template( "practice_combined_ibex.csv" ,
    // Row will iteratively point to every row in practice_combined_ibex.csv
    row => newTrial( "practice" ,
                    // use the text (no print) of the TrialType and test function to branch 2 trail types
                    newText("TrialType", row.TrialType)
                        .test.text("Stroop_Sentence")
                        .success( // fixation cross for stroop                                ,
                                getImage("fixation")
                                    .print("center at 50%", "middle at 37.5%")
                                ,
                                newTimer(300)
                                    .start()
                                    .wait()
                                ,
                                getImage("fixation")
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                , // show stroop word
                                newText("stroop_word", row.Word)
                                    .color(row.FontColourCode)
                                    .css("font-size", "1.5em")
                                    .print("center at 50%", "middle at 37.5%")
                                ,
                                newTimer("delay1", 1000)
                                    .start()
                                , //timer.stop will stop timer and will not continue it again
                                newKey("re_stroop", 49, 50, 51)
                                    .callback(getTimer("delay1").stop())
                                ,
                                getTimer("delay1")
                                    .wait()
                                ,
                                getText("stroop_word")
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                , // fixation cross for sentence
                                getImage("fixation")
                                    .print("center at 50%", "middle at 37.5%")
                                ,
                                newTimer(300)
                                    .start()
                                    .wait()
                                ,
                                getImage("fixation")
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                , // self-paced sentence reading and question
                                newController("DashedSentence",{s:row.Sentence})
                                    .center()
                                    .print("center at 50%", "middle at 37%")
                                    .wait()
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                ,
                                newController("Question", {q:row.Question, as: ["yes","no"]})
                                    .center()
                                    .print("center at 50%", "middle at 44.5%")
                                    .wait()
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                )
                        .failure( // fixation cross for sentence
                                getImage("fixation")
                                    .print("center at 50%", "middle at 37.5%")
                                ,
                                newTimer(300)
                                    .start()
                                    .wait()
                                ,
                                getImage("fixation")
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                , // self-paced sentence reading and question
                                newController("DashedSentence",{s:row.Sentence})
                                    .center()
                                    .print("center at 50%", "middle at 37%")
                                    .wait()
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                ,
                                newController("Question", {q:row.Question, as: ["yes","no"]})
                                    .center()
                                    .print("center at 50%", "middle at 44.5%")
                                    .wait()
                                    .remove()
                                , // fixation cross for stroop
                                getImage("fixation")
                                    .print("center at 50%", "middle at 37.5%")
                                ,
                                newTimer(300)
                                    .start()
                                    .wait()
                                ,
                                getImage("fixation")
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                , // show stroop word
                                newText("stroop_word", row.Word)
                                    .color(row.FontColourCode)
                                    .css("font-size", "1.5em")
                                    .print("center at 50%", "middle at 37.5%")
                                ,
                                newTimer("delay2", 1000)
                                    .start()
                                , //timer.stop will stop timer and will not continue it again
                                newKey("re_stroop", 49, 50, 51)
                                    .callback(getTimer("delay2").stop())
                                ,
                                getTimer("delay2")
                                    .wait()
                                ,
                                getText("stroop_word")
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                )
        )
)

// Part5: real experiment blocks
newTrial("exp_instru",
    newText("Practice done! Here is a quick review:")
        .css("font-size", "1.7em")
        .print()
    ,
    newHtml("exp_instru", "exp_instru.html")
        .print()
    ,
    newButton("Continue")
        .css("font-size", "1.5em")
        .print()
        .wait()
    
)

Template(
        GetTable("stimuli_ibex_test_2blocks.csv")
        .filter("Block", "1"),
    row => newTrial( "block1" ,
        newText("TrialType", row.TrialType)
            .test.text("Stroop_Sentence")
                        .success( // fixation cross for stroop,
                                getImage("fixation")
                                    .print("center at 50%", "middle at 37.5%")
                                ,
                                newTimer(300)
                                    .start()
                                    .wait()
                                ,
                                getImage("fixation")
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                , // show stroop word
                                newText("stroop_word", row.Word)
                                    .color(row.FontColourCode)
                                    .css("font-size", "1.5em")
                                    .print("center at 50%", "middle at 37.5%")
                                ,
                                newTimer("delay1", 1000)
                                    .start()
                                , //timer.stop will stop timer and will not continue it again
                                newKey("re_stroop", 49, 50, 51)
                                    .log()
                                    .callback(getTimer("delay1").stop())
                                ,
                                getTimer("delay1")
                                    .wait()
                                ,
                                getText("stroop_word")
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                , // fixation cross for sentence
                                getImage("fixation")
                                    .print("center at 50%", "middle at 37.5%")
                                ,
                                newTimer(300)
                                    .start()
                                    .wait()
                                ,
                                getImage("fixation")
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                , // self-paced sentence reading and question
                                newController("DashedSentence",{s:row.Sentence})
                                    .center()
                                    .print("center at 50%", "middle at 37%")
                                    .log()
                                    .wait()
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                ,
                                newController("Question", {q:row.Question, as: ["yes","no"]})
                                    .center()
                                    .print("center at 50%", "middle at 44.5%")
                                    .log()
                                    .wait()
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                )
                        .failure( // fixation cross for sentence
                                getImage("fixation")
                                    .print("center at 50%", "middle at 37.5%")
                                ,
                                newTimer(300)
                                    .start()
                                    .wait()
                                ,
                                getImage("fixation")
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                , // self-paced sentence reading and question
                                newController("DashedSentence",{s:row.Sentence})
                                    .center()
                                    .print("center at 50%", "middle at 37%")
                                    .log()
                                    .wait()
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                ,
                                newController("Question", {q:row.Question, as: ["yes","no"]})
                                    .center()
                                    .print("center at 50%", "middle at 44.5%")
                                    .log()
                                    .wait()
                                    .remove()
                                , // fixation cross for stroop
                                getImage("fixation")
                                    .print("center at 50%", "middle at 37.5%")
                                ,
                                newTimer(300)
                                    .start()
                                    .wait()
                                ,
                                getImage("fixation")
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                , // show stroop word
                                newText("stroop_word", row.Word)
                                    .color(row.FontColourCode)
                                    .css("font-size", "1.5em")
                                    .print("center at 50%", "middle at 37.5%")
                                ,
                                newTimer("delay2", 1000)
                                    .start()
                                , //timer.stop will stop timer and will not continue it again
                                newKey("re_stroop", 49, 50, 51)
                                    .log()
                                    .callback(getTimer("delay2").stop())
                                ,
                                getTimer("delay2")
                                    .wait()
                                ,
                                getText("stroop_word")
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                )
        )
.log("Block" , row.Block)
.log("Group" , row.Group)
.log("Item" , row.Item)
.log("Condition", row.Condition)
    // Add these three columns to the results lines of these Template-based trials
)

newTrial("break",
    newText("<p>You can take a break or click the button to continue</p>")
        .bold()
        .css("font-size", "1.5em")
        .print()
    ,
    newButton("&nbsp; Continue &nbsp;")
        .center()
        .css("font-size", "1.5em")
        .print()
        .wait()
)

// This Template command generates as many trials as there are rows in stimuli_ibex.csv
Template(
        GetTable("stimuli_ibex_test_2blocks.csv")
        .filter("Block", "2")
        ,
    row => newTrial( "block2" ,
        newText("TrialType", row.TrialType)
            .test.text("Stroop_Sentence")
                        .success( // fixation cross for stroop                                ,
                                getImage("fixation")
                                    .print("center at 50%", "middle at 37.5%")
                                ,
                                newTimer(300)
                                    .start()
                                    .wait()
                                ,
                                getImage("fixation")
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                , // show stroop word
                                newText("stroop_word", row.Word)
                                    .color(row.FontColourCode)
                                    .css("font-size", "1.5em")
                                    .print("center at 50%", "middle at 37.5%")
                                ,
                                newTimer("delay1", 1000)
                                    .start()
                                , //timer.stop will stop timer and will not continue it again
                                newKey("re_stroop", 49, 50, 51)
                                    .log()
                                    .callback(getTimer("delay1").stop())
                                ,
                                getTimer("delay1")
                                    .wait()
                                ,
                                getText("stroop_word")
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                , // fixation cross for sentence
                                getImage("fixation")
                                    .print("center at 50%", "middle at 37.5%")
                                ,
                                newTimer(300)
                                    .start()
                                    .wait()
                                ,
                                getImage("fixation")
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                , // self-paced sentence reading and question
                                newController("DashedSentence",{s:row.Sentence})
                                    .center()
                                    .print("center at 50%", "middle at 37%")
                                    .log()
                                    .wait()
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                ,
                                newController("Question", {q:row.Question, as: ["yes","no"]})
                                    .center()
                                    .print("center at 50%", "middle at 44.5%")
                                    .log()
                                    .wait()
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                )
                        .failure( // fixation cross for sentence
                                getImage("fixation")
                                    .print("center at 50%", "middle at 37.5%")
                                ,
                                newTimer(300)
                                    .start()
                                    .wait()
                                ,
                                getImage("fixation")
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                , // self-paced sentence reading and question
                                newController("DashedSentence",{s:row.Sentence})
                                    .center()
                                    .print("center at 50%", "middle at 37%")
                                    .log()
                                    .wait()
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                ,
                                newController("Question", {q:row.Question, as: ["yes","no"]})
                                    .center()
                                    .print("center at 50%", "middle at 44.5%")
                                    .log()
                                    .wait()
                                    .remove()
                                , // fixation cross for stroop
                                getImage("fixation")
                                    .print("center at 50%", "middle at 37.5%")
                                ,
                                newTimer(300)
                                    .start()
                                    .wait()
                                ,
                                getImage("fixation")
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                                , // show stroop word
                                newText("stroop_word", row.Word)
                                    .color(row.FontColourCode)
                                    .css("font-size", "1.5em")
                                    .print("center at 50%", "middle at 37.5%")
                                ,
                                newTimer("delay2", 1000)
                                    .start()
                                , //timer.stop will stop timer and will not continue it again
                                newKey("re_stroop", 49, 50, 51)
                                    .log()
                                    .callback(getTimer("delay2").stop())
                                ,
                                getTimer("delay2")
                                    .wait()
                                ,
                                getText("stroop_word")
                                    .remove()
                                ,
                                newTimer(200)
                                    .start()
                                    .wait()
                )
        )
.log("Block" , row.Block)
.log("Group" , row.Group)
.log("Item" , row.Item)
.log("Condition", row.Condition)
    // Add these three columns to the results lines of these Template-based trials
)

SendResults()

// Spaces and linebreaks don't matter to the script: we've only been using them for the sake of readability
newTrial("bye",
    newText("<br/>This is the end of the experiment.<br/><br/>")
        .css("font-size", "1.5em")
        .print()
    ,
    newButton("&nbsp; Click here to validate your participation. &nbsp;")
        .css("font-size", "1.5em")
        .print()
        .wait()
    ,
    newText("<br/><br/><br/><b>Well done! Thanks for your participation.</b>")
        .css("font-size", "1.5em")
        .print()
    ,
    newButton("void")
        .wait()
)

.setOption( "countsForProgressBar" , false )
// Make sure the progress bar is full upon reaching this last (non-)trial
