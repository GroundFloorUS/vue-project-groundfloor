import MurrayMedia from '@/components/MurrayMedia'

export default {
  // The way this was written before would not have properly handled an api error
  async asyncData({ $axios }) {
    return new Promise((resolve,reject) => {
      $axios.get('/api/funding')
        .then((response) => {
          if (response && response.data) {
            resolve({
              funding: response.data
            })
          } else {
            console.error('Invalid response!', response);
            reject(new Error('Invalid response'));
          }
        })
        .catch(reject);
    });
  },
  components: {
    MurrayMedia,
  }
}
