Vue.component("line-chart", {
  extends: VueChartJs.Line,
  props: ["data", "options", "label"],
  mounted() {
    this.renderLineChart();
  },
  computed: {
    chartData: function() {
      return this.data;
    },
    labels: function() {
      return this.label;
    }
  },
  methods: {
    renderLineChart: function() {
      this.renderChart(
        {
          labels: this.labels,
          datasets: [
            {
              label: "Semester Average Grade",
              backgroundColor: "#f87979",
              data: this.chartData
            }
          ]
        },
        { responsive: true, maintainAspectRatio: false }
      );
    }
  },
  watch: {
    data: function() {
      this._chart.destroy();
      console.log(this.data);
      console.log(this.options);
      //this.renderChart(this.data, this.options);
      this.renderLineChart();
    }
  }
});

var profilepage = new Vue({
  el: "#profile",
  data: {
    personalInfo: {
      name: "John Doh",
      metricNumber: "",
      email: "",
      contactNumber: "",
      address: "",
      profilePic:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcNusDQ1v1fI3iyILqAHNX7EAVw5UOVcYy_vmURFqUCjk3sR1IzA"
    },
    degreeInfo: {
      cohortYear: "AY 2015/2016",
      homeFaculty1: "School of Computing",
      homeFaculty2: "",
      academicMajor1: "Business Analytics",
      academicMajor2: "",
      academicDegree1: "Bachelor of Science (Honors)",
      academicDegree2: "",
      academicMinor: "",
      requiredMC: [
        { type: "University Level Requirements", number: 20 },
        { type: "Degree Requirements", number: 120 },
        { type: "Unrestricted Electives", number: 20 }
      ]
    },
    modulesTaken: [
      {
        moduleCode: "BT1101",
        moduleName: "Introduction to Business Analytics",
        modularCredits: 4,
        gradeEarned: 4.5,
        whetherSU: "N",
        moduleType: "Degree Requirements",
        semesterTaken: "Y1 S1"
      },
      {
        moduleCode: "GEH1001",
        moduleName: "Globalization and New Media",
        modularCredits: 4,
        gradeEarned: 4.0,
        whetherSU: "N",
        moduleType: "University Level Requirements",
        semesterTaken: "Y1 S1"
      },
      {
        moduleCode: "EC2101",
        moduleName: "Microeconomics I",
        modularCredits: 4,
        gradeEarned: 5.0,
        whetherSU: "N",
        moduleType: "Unrestricted Electives",
        semesterTaken: "Y1 S1"
      },
      {
        moduleCode: "CS1010S",
        moduleName: "Programming Methodology",
        modularCredits: 4,
        gradeEarned: 5.0,
        whetherSU: "N",
        moduleType: "Degree Requirements",
        semesterTaken: "Y1 S1"
      },
      {
        moduleCode: "MKT1003X",
        moduleName: "Principles of Marketing",
        modularCredits: 4,
        gradeEarned: 4.0,
        whetherSU: "Y",
        moduleType: "Degree Requirements",
        semesterTaken: "Y1 S1"
      },
      {
        moduleCode: "BT2101",
        moduleName: "Decision Making Methods and Tools",
        modularCredits: 4,
        gradeEarned: 4.5,
        whetherSU: "N",
        moduleType: "Degree Requirements",
        semesterTaken: "Y1 S2"
      },
      {
        moduleCode: "IS1103",
        moduleName: "IT Innovation in Organisation and Society",
        modularCredits: 4,
        gradeEarned: 3.5,
        whetherSU: "N",
        moduleType: "Degree Requirements",
        semesterTaken: "Y1 S2"
      },
      {
        moduleCode: "GES1002",
        moduleName: "Global EC Dimension of Singapore",
        modularCredits: 4,
        gradeEarned: 4.0,
        whetherSU: "N",
        moduleType: "University Level Requirements",
        semesterTaken: "Y1 S2"
      }
    ]
  },
  computed: {
    totalMCRequired() {
      var count = 0.0;
      for (var item in this.degreeInfo.requiredMC) {
        count += this.degreeInfo.requiredMC[item].number;
      }
      console.log(count);
      return count;
    },
    totalMCEarned() {
      var count = 0.0;
      for (var item in this.modulesTaken) {
        count += this.modulesTaken[item].modularCredits;
      }
      console.log(count);
      return count;
    },
    currentCAP() {
      var count = 0;
      var mc = 0;
      for (var item in this.modulesTaken) {
        var currMod = this.modulesTaken[item];
        if (currMod.whetherSU != "Y") {
          count +=
            this.modulesTaken[item].modularCredits *
            this.modulesTaken[item].gradeEarned;
          mc += this.modulesTaken[item].modularCredits;
        }
      }
      var cap = count / mc;
      console.log(cap);
      return cap.toFixed(2);
    },
    byModuleTypeProgress() {
      var dic = this.degreeInfo.requiredMC;
      for (var index in dic) {
        var currType = dic[index].type;
        var count = 0;
        for (var id in this.modulesTaken) {
          var currMod = this.modulesTaken[id];
          if (currMod.moduleType == currType) {
            count += currMod.modularCredits;
          }
        }
        dic[index].earned = count;
      }
      console.log(dic);
      return dic;
    },
    bySemCAP() {
      var res = {
        "Y1 S1": [],
        "Y1 S2": [],
        "Y2 S1": [],
        "Y2 S2": [],
        "Y3 S1": [],
        "Y3 S2": [],
        "Y4 S1": [],
        "Y4 S2": []
      };
      for (var index in this.modulesTaken) {
        var currMod = this.modulesTaken[index];
        var currSem = currMod.semesterTaken;
        var currCAP = currMod.gradeEarned;
        var currMC = currMod.modularCredits;
        res[currSem].push([currCAP, currMC]);
      }
      console.log(res);

      var res2 = [];
      for (var id in res) {
        var currSem = res[id];
        var totalGrade = 0;
        var totalMC = 0;
        for (var index in currSem) {
          var currMod = currSem[index];
          totalGrade += currMod[0] * currMod[1];

          totalMC += currMod[1];
        }
        if (totalMC != 0) {
          var currSAP = totalGrade / totalMC;
        } else {
          var currSAP = 0;
        }

        res2.push([id, currSAP.toFixed(2)]);
      }
      console.log(res2);
      var res3 = [[], []];
      for (var index in res2) {
        if (res2[index][1] != 0) {
          res3[0].push(res2[index][0]);
          res3[1].push(res2[index][1]);
        }
      }
      console.log(res3);
      return res3;
    }
  }
});
