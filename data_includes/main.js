PennController.ResetPrefix(null) // Shorten command names (keep this line here)

// Show the 'intro' trial first, then all the 'experiment' trials in a random order
// then send the results and finally show the trial labeled 'bye'
Sequence( "intro", "practice_color", "color_matching", "practice_stroop", "stroop", "practice_combined", "practice", "exp_instru", randomize("experiment"), SendResults(), "bye" )


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
        // This setVar command stores the value from the TextInput element into the Var element
)


newTrial("practice_color",
    newHtml("prac_col", "prac_instru1.html")
        .print()
    ,
    newKey(" ")
        .wait()
)

Template( "practice_matching_ibex.csv",
    row => newTrial("color_matching",
                newText("col_pad", row.Word)
                    .color(row.FontColourCode)
                    .css("font-size", "7em")
                    .print()
                ,
                newKey("re_col", "QWE")
                    .wait()
                ,
                getText("col_pad")
                    .remove()
                ,
                getKey("re_col")
                    .test.pressed(row.Button)
                        .success(newText("<br/><br/><br/><br/>CORRECT!")
                            .print())
                        .failure(newText("<br/><br/><br/><br/>INCORRECT!")
                            .color("red")
                            .print())
                ,
                newTimer(1000)
                    .start()
                    .wait()
        )
)

newTrial("practice_stroop",
    newText("<p>Then we'll print colour names in different inks.</p><p>Press <b>space bar</b> to start practice</p>")
        .css("font-size", "1.2em")
        .print()
    ,
    newKey(" ")
        .wait()
)

Template( "practice_stroop_ibex.csv",
    row => newTrial("stroop",
                newText("word", row.Word)
                    .color(row.FontColourCode)
                    .css("font-size", "1.5em")
                    .print()
                ,
                newKey("re_col", "QWE")
                    .wait()
                ,
                getText("word")
                    .remove()
                ,
                getKey("re_col")
                    .test.pressed(row.Button)
                        .success(newText("<br/><br/><br/>CORRECT!")
                            .print())
                        .failure(newText("<br/><br/><br/>INCORRECT!")
                            .color("red")
                            .print())
                ,
                newTimer(1000)
                    .start()
                    .wait()
        )
)


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
    // Row will iteratively point to every row in stimuli_ibex.csv
    row => newTrial( "practice" ,
        newText("TrialType", row.TrialType)
            .test.text("Stroop_Sentence")
            .success(
                newText("Stroop", row.Word)
                    .color(row.FontColourCode)
                    .css("font-size", "1.5em")
                    .print()
                ,
                newKey("re_prac","QWE")
                    .wait()
                ,
                getText("Stroop")
                    .remove()
                ,
                newController("DashedSentence",{s:row.Sentence})
                    .print()
                    .wait()
                    .remove()
                ,
                newController("Question", {q:row.Question, as: ["yes","no"]})
                    .print()
                    .wait()
                    .remove()
                )
            .failure(
                newController("DashedSentence",{s:row.Sentence})
                    .print()
                    .wait()
                    .remove()
                ,
                newController("Question", {q:row.Question, as: ["yes","no"]})
                    .print()
                    .wait()
                    .remove()
                ,
                newText("Stroop", row.Word)
                        .color(row.FontColourCode)
                        .css("font-size", "1.5em")
                        .print()
                ,
                newKey("QWE")
                    .wait()
                ,
                getText("Stroop")
                    .remove()
                )
        )
)


newTrial("exp_instru",
    newText("Practice done! Here is a quick review:")
        .css("font-size", "1.7em")
        .print()
    ,
    newHtml("exp_instru", "exp_instru.html")
        .print()
    ,
    newKey(" ")
        .wait()
    
)

// This Template command generates as many trials as there are rows in stimuli_ibex.csv
Template( "stimuli_ibex.csv" ,
    // Row will iteratively point to every row in stimuli_ibex.csv
    row => newTrial( "experiment" ,
        newText("TrialType", row.TrialType)
            .test.text("Stroop_Sentence")
            .success(
                newText("Stroop", row.Word)
                    .color(row.FontColourCode)
                    .css("font-size", "1.5em")
                    .print()
                ,
                newKey("QWE")
                    .log()
                    .wait()
                ,
                getText("Stroop")
                    .remove()
                ,
                newController("DashedSentence",{s:row.Sentence})
                    .print()
                    .log()
                    .wait()
                    .remove()
                ,
                newController("Question", {q:row.Question, as: ["yes","no"]})
                    .print()
                    .log()
                    .wait()
                    .remove()
                )
            .failure(
                newController("DashedSentence",{s:row.Sentence})
                    .print()
                    .log()
                    .wait()
                    .remove()
                ,
                newController("Question", {q:row.Question, as: ["yes","no"]})
                    .print()
                    .log()
                    .wait()
                    .remove()
                ,
                newText("Stroop", row.Word)
                        .color(row.FontColourCode)
                        .css("font-size", "1.5em")
                        .print()
                ,
                newKey("QWE")
                    .log()
                    .wait()
                ,
                getText("Stroop")
                    .remove()
                )
    )
    .log("Group" , row.Group)
    .log("Condition", row.Condition)
    // Add these three columns to the results lines of these Template-based trials
)

SendResults()

// Spaces and linebreaks don't matter to the script: we've only been using them for the sake of readability
newTrial("bye",
    newText("<br/>This is the end of the experiment.<br/><br/>")
        .css("font-size", "1.7em")
        .print()
    ,
    newButton("Click here to validate your participation.")
        .css("font-size", "1.7em")
        .print()
        .wait()
    ,
    newText("<br/><br/><br/><b>Well done! Thanks for your participation.</b>")
        .css("font-size", "1.7em")
        .print()
    ,
    newButton("void")
        .wait()
)

.setOption( "countsForProgressBar" , false )
// Make sure the progress bar is full upon reaching this last (non-)trial
