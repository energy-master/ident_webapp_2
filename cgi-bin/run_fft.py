#/usr/bin/pyhton3
import numpy as np
import os
os.environ['NUMBA_CACHE_DIR'] = '/tmp'
import librosa as lr
import scipy
import json
import sys
import soundfile as sf

def flac2array(flac_path, dtype="float32"): 
    data, sr = sf.read(flac_path, dtype=dtype, always_2d=True)
    return data, sr


MAX_NUMBER_POINTS = 2000000
PATH = '/media/marlin/Elements2/html/marlin_live_data'

# ----- GRAB FILE -----

target_file = sys.argv[1]
run_id = sys.argv[2]
#sampling_factor = int(sys.argv[3])

id = run_id

file = ''
fileName = ''
if '/' in target_file:
    file = target_file
else:
    file = f'/media/marlin/Elements2/html/marlin_live/{target_file}'

file_split = file.split('.')
file_ext = file_split[1]

sr = -1
y = None
sr_ = -1


if (file_ext=='.flac'):
    y, sr_ = sf.read(file,always_2d=True)     

else:
    sr = lr.get_samplerate(file)
    y, sr_ = lr.load(file, sr=sr)
    
    



# print (sr)


# ----- GRAB FFT -----




n_fft =  2048

# y_size = 2 * sr_
# y = y[0:y_size]

S = np.abs(lr.stft(y,n_fft=n_fft, hop_length=(n_fft//2)))
# print (len(y))
tf = lr.frames_to_time(range(0, S.shape[1]), sr=sr, hop_length=(n_fft//2), n_fft=n_fft)
duration = len(y)/sr_
print (duration)
tdim = (len(tf))
ff = lr.fft_frequencies(sr=sr_, n_fft=n_fft)
# print (len(ff))
fdim = len(ff)
number_points = tdim * fdim

factor_reduction = int(max(float(number_points/MAX_NUMBER_POINTS), 1))

sampling_factor = factor_reduction
S_data = {}

def sample_time(t_data):
    sampled_data = t_data
    return sampled_data[::sampling_factor]

f_cnt = 0
for t_v in S:
    t_data = sample_time(t_v.tolist())
    # print (len(f_idx))
    S_data[f_cnt] = (t_data)
    f_cnt +=1


# print (S_data)

export_data = {
    'fft'   : S_data,
    'f_vec' :ff.tolist(),
    't_vec' :tf.tolist()
}



sampled_data = {}



# print (S_data)
with open(f'{PATH}/fft_{id}.json', 'w') as f:
    json.dump(export_data,f)


# print (S)
# print (len(y))
# duration = len(y)/sr_
# print (duration)

# import numpy as np
# from scipy import signal
# # from scipy.fft import fftshift

# tt = lr.time_to_frames(60, sr=sr, n_fft=16384)
# print ((tt))
# f, t, Sxx = signal.spectrogram(y, fs=sr, nfft=16384)

# print (f)
# print (t)
# print (np.shape(t))
# # print (Sxx)
# print (len(f), len(t))
# print (type(Sxx))

# # f.tofile(f'{PATH}/{id}_f.np')
# # t.tofile(f'{PATH}/{id}_t.np')
# # Sxx.tofile(f'{PATH}/{id}_s.np')
# # print (np.shape(Sxx))
# # S = np.fromfile(f'{PATH}/{id}_s.np', dtype=np.float32)
# # print (S[0])
# # print (type(S))
# # print (np.shape(S))

