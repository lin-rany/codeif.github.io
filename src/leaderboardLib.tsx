import React from "react"
import styles from "./Leaderboard.module.css"
import { exec } from "child_process"

function mean(array: Array<number>) {
  return array.reduce((a, b) => a + b, 0) / array.length
}

function formatNumber(number: number) {
  return Number(number.toFixed(3))
}

/**
 * ```python
 * def _get_pass_at_1(model):
 *     results = results_df[results_df["model"] == model]
 *     # date filter
 *     results = results[results["date"] >= start]
 *     results = results[results["date"] <= end]
 *     average_pass = results["pass@1"].mean()
 *     easy_pass = results[results["difficulty"] == "easy"]["pass@1"].mean()
 *     medium_pass = results[results["difficulty"] == "medium"]["pass@1"].mean()
 *     hard_pass = results[results["difficulty"] == "hard"]["pass@1"].mean()
 *     atcoder_pass = results[results["platform"] == "atcoder"]["pass@1"].mean()
 *     codeforces_pass = results[results["platform"] == "codeforces"]["pass@1"].mean()
 *     leetcode_pass = results[results["platform"] == "leetcode"]["pass@1"].mean()
 *     # print(results['platform'].value_counts())
 *     hard_results = results[results["difficulty"] == "hard"]
 *     print(model, "-->", hard_results[(hard_results["pass@1"] > 0)].question_id.tolist())
 *     return (
 *         average_pass,
 *         easy_pass,
 *         medium_pass,
 *         hard_pass,
 *         atcoder_pass,
 *         leetcode_pass,
 *         codeforces_pass,
 *     )
 * ```
 */
// function get_pass_at_1(
//   results_df: Array<any>,
//   model: string,
//   start: number,
//   end: number
// ) {
//   // model and date filter
//   const results = results_df.filter(
//     (result) =>
//       result["model"] === model &&
//       result["date"] >= start &&
//       result["date"] <= end
//   )

//   const average_pass = formatNumber(
//     mean(results.map((result) => result["pass@1"]))
//   )
//   const easy_pass = formatNumber(
//     mean(
//       results
//         .filter((result) => result["difficulty"] === "easy")
//         .map((result) => result["pass@1"])
//     )
//   )
//   const medium_pass = formatNumber(
//     mean(
//       results
//         .filter((result) => result["difficulty"] === "medium")
//         .map((result) => result["pass@1"])
//     )
//   )
//   const hard_pass = formatNumber(
//     mean(
//       results
//         .filter((result) => result["difficulty"] === "hard")
//         .map((result) => result["pass@1"])
//     )
//   )

//   const exec_pass = formatNumber(
//     mean(results.map((result) => result["Pass@1"]))
//   )

//   const cot_pass = formatNumber(
//     mean(results.map((result) => result["Pass@1-COT"]))
//   )

//   // console.log("COT PASS: ", cot_pass, cot_pass != undefined, cot_pass != null, cot_pass.toString() != "NaN")

//   return {
//     average_pass,
//     easy_pass,
//     medium_pass,
//     hard_pass,
//     exec_pass,
//     cot_pass,
//   }
// }
function get_pass_at_1(
  results_df: Array<any>,
  model: string,
  type: string
) {
  // model and date filter
  const results = results_df.filter(
    (result) =>
      result["model"] === model
  )

  const CCS = formatNumber(
    mean(results.map((result) => result[type+"_CCS"]))
  )
  const SS = formatNumber(
    mean(results.map((result) => result[type+"_SS"]))
  )
  const RS = formatNumber(
    mean(results.map((result) => result[type+"_RS"]))
  )
  const CS = formatNumber(
    mean(results.map((result) => result[type+"_CS"]))
  )

  // console.log("COT PASS: ", cot_pass, cot_pass != undefined, cot_pass != null, cot_pass.toString() != "NaN")

  return {
    CS,
    SS,
    RS,
    CCS
  }
}
/**
 *
 * ```python
 * pd.DataFrame(
 *     {
 *         model: {
 *             "Model": model.model_repr,
 *             "Release Date": model.release_date.date(),
 *             "Contaminated": model.release_date > start,
 *             "Pass@1": _get_pass_at_1(model.model_repr)[0],
 *             "Easy-Pass@1": _get_pass_at_1(model.model_repr)[1],
 *             "Medium-Pass@1": _get_pass_at_1(model.model_repr)[2],
 *             "Hard-Pass@1": _get_pass_at_1(model.model_repr)[3],
 *             # "AtCoder-Pass@1": _get_pass_at_1(
 *             #     model.model_repr
 *             # )[4],
 *             # "LeetCode-Pass@1": _get_pass_at_1(
 *             #     model.model_repr
 *             # )[5],
 *             # "CodeForces-Pass@1": _get_pass_at_1(
 *             #     model.model_repr
 *             # )[6],
 *             # "Naive Test Cases Correctness": _get_naive_test_cases_correctness(
 *             #     model, questions_filtered
 *             # ),
 *         }
 *         for model in results_df.model_class.unique()
 *     }
 * )
 * ```
 */
// function getLeaderboard(
//   performances: Array<any>,
//   models: Array<any>,
//   start: number,
//   end: number
// ) {
//   return models
//     // .filter((model) => model.release_date)
//     .map((model) => {
//       const { CCS } = get_pass_at_1(
//         performances,
//         model.model_repr,
//         start,
//         end
//       )
      
//       let output = {
//         Model: model.model_repr,
//         // "Estimated Cutoff For codeIF":
//         //   "Estimated Cutoff For codeIF: " + new Date(model.release_date).toLocaleDateString(),
//         "Contaminated":false,
//         "CCS": CCS.toString() === "NaN"? -1 : CCS,
//       }
//       return output
      
//     })
//     .sort((a, b) => b["CCS"] - a["CCS"])
//     .reduce(
//       (
//         acc: {
//           results: Array<typeof model & { Rank: number | null }>
//           rank: number
//         },
//         model
//       ) => {
//         let rank = null
//         acc.results.push({
//           Rank: rank,
//           ...model,
//         })
//         return acc
//       },
//       { results: [], rank: 1 }
//     ).results
// }

function getLeaderboard(
  performances: Array<any>,
  models: Array<any>,
  type: string
) {
  return models
    .map((model) => {
      const { CS,SS,RS,CCS } = get_pass_at_1(performances, model.model_repr,type);
      return {
        Model: model.model_name,
        CS: isNaN(CS)? -1 : CS,
        SS: isNaN(SS)? -1 : SS,
        RS: isNaN(RS)? -1 : RS,
        CCS: isNaN(CCS) ? -1 : CCS,
      };
    })
    .sort((a, b) => b["CS"] - a["CS"])
    .map((item, index) => ({      // 添加 rank 字段
      ...item,
      Rank: index + 1  // 排名从 1 开始
  }));
}

function getDateMarksFromModels(models: Array<any>) {
  const modelDates = models
    .filter((model) => model.release_date)
    .map((model) => model.release_date)

  const uniqueDates = [
    // @ts-ignore
    ...new Set(modelDates),
    new Date("2024-01-01").getTime(),
  ]

  return uniqueDates
    .map((date) => ({
      value: date,
      label: new Date(date).toLocaleDateString(undefined, {
        timeZone: "UTC",
      }),
    }))
    .sort((a, b) => a.value - b.value)
}

function getDateMarksFromTimestamps(timestamps: Array<number>) {
  return timestamps.map((timestamp) => ({
    value: timestamp,
    label: new Date(timestamp).toLocaleDateString(undefined, {
      timeZone: "UTC",
    }),
  }))
}

function getColumnDefs(columnNames: Array<string>) {
  // Format the columns into array of { field: "column_name" }
  return columnNames
    .map((column_name) => {
      switch (column_name) {
        case "Rank":
          return {
            field: column_name,
            suppressMovable: true,
            cellClass: 'suppress-movable-col',
          }

        case "Model":
          return {
            field: column_name,
            suppressMovable: true,
            cellClass: 'suppress-movable-col',
            flex: 2,
            tooltipField: "Estimated Cutoff For LiveCodeBench",
            // cellRenderer: (params: any) => {
            //   return modelsDict[params.value].link ? (
            //     <a
            //       href={modelsDict[params.value].link}
            //       target="_blank"
            //       className={styles.leaderboardModelLink}
            //     >
            //       {params.value}
            //     </a>
            //   ) : (
            //     params.value
            //   )
            // },
          }

        case "Estimated Cutoff For LiveCodeBench":
          return null

        case "Contaminated":
          return null
          return {
            field: column_name,
            headerTooltip: `
              Model is considered contaminated if it is released after the start date of
              the selected problems set.
            `,
          }

        case "Pass@1":
          return {
            field: column_name,
            headerTooltip: `
              Pass@1 is probability of passing a given problem in one attempt.
            `,
            sort: "desc",
          }
        case "Pass@1-COT":
          return {
            field: column_name,
            headerTooltip: `
                Pass@1 is probability of passing a given problem in one attempt with CoT.
              `,
            sort: "desc",
          }

        case "Pass@1 (no COT)":
          return {
            field: column_name,
            headerTooltip: `
                  Pass@1 is probability of passing a given problem in one attempt without CoT.
                `,
            sort: "desc",
          }

        case "Easy-Pass@1":
          return {
            field: column_name,
            headerTooltip: "Pass@1 on problems with Easy difficulty",
          }

        case "Medium-Pass@1":
          return {
            field: column_name,
            headerTooltip: "Pass@1 on problems with Medium difficulty",
          }

        case "Hard-Pass@1":
          return {
            field: column_name,
            headerTooltip: "Pass@1 on problems with Hard difficulty",
          }

        default:
          return {
            field: column_name,
          }
      }
    })
    .filter((columnDef) => columnDef !== null)
}
// function getColumnDefs(columnNames: Array<string>) {
//   return columnNames.map((column_name) => ({
//     field: column_name,
//     flex: column_name === "Model" ? 2 : 1, // 仅保留基础列配置
//     suppressMovable: true,
//     cellClass: 'suppress-movable-col',
//   }));
// }

export { getDateMarksFromTimestamps, getLeaderboard, getColumnDefs }
