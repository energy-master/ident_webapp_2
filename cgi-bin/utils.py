
# import matplotlib as plt


import os 
os.environ['MPLCONFIGDIR'] = os.getcwd() 
import matplotlib.pyplot as plt
import numpy as np

def build_spec(data,  id, bot_id, n_fft = None, f_min = 0, f_max = 0, custom=0, sr=96000, identifier=0):
    print ("building spec")
    
    
    if custom == 1:
    
        y = data * 40
        if n_fft == None:
            n_fft = 8192
        else:
            n_fft = int(n_fft)
        
        sample_rate = sr
        print ("build")
        plt.specgram(y,NFFT=n_fft, Fs=sample_rate, scale="dB",mode="magnitude",cmap="ocean")
        plt.colorbar()
        print ("done")
    
        plt.ylabel('Frequency (H)')
        plt.xlabel('Time (s)')
        
        if f_max != 0:
            plt.ylim([int(f_min), int(f_max)])

        if bot_id != "debug":
            pass
            # snapshot_id =  data.meta_data['snapshot_id']
            # filepath = f'/home/vixen/html/rs/ident_app/ident/brahma/out/{snapshot_id}_{bot_id}_main_spec.png'
        
        else:
            
            filepath = f'/media/marlin/Elements2/html/html_data/html_data/{identifier}.png'
        
        plt.savefig(filepath)
    
  
    
