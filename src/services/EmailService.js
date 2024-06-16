import axios from "axios";

const url = "http://localhost:8013";

export default {
  sendMail: (data) => {
    return axios({
      method: "POST",
      baseURL: url,
      url: `/store/send-email`,
      data: data,
    });
  },
};
