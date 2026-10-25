$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$speech = New-Object System.Speech.Synthesis.SpeechSynthesizer
$speech.SelectVoice('Microsoft Zira Desktop')
$speech.Rate = -1
$videoWork = Join-Path $PSScriptRoot 'video-work'
New-Item -ItemType Directory -Force $videoWork | Out-Null
$scenes = @(
 @{image='01-workspace.png';text='Welcome to Trace Climate, an environmental evidence workspace for the IEEE Climate Chain Global Hackathon. This narrated walkthrough uses captured screens from the working prototype. Our track is Climate Data and Environmental Monitoring. Community sensor teams and researchers often share observations as spreadsheets. Two questions matter before sharing: which readings deserve review, and has the dataset changed? Trace Climate connects an explainable screening process with a reproducible evidence fingerprint. The interface shown here is running locally, with no paid service, cloud account, or browser wallet required.'},
 @{image='03-flagged-readings.png';text='The demonstration contains forty eight synthetic temperature observations, including two deliberately injected spikes. These are not measurements from a deployed Bangkok sensor. Selecting the flagged readings filter isolates the two unusual values. A robust statistical score compares each temperature with the median of the dataset, using median absolute deviation. Scores above three point five are flagged. This is deterministic statistics, not a trained artificial intelligence model. A flag is a reason for human review, not proof of an error. All readings remain in the evidence, including both spikes.'},
 @{image='04-ledger.png';text='After review, the anchor evidence action normalizes timestamps to UTC, sorts the readings, and computes SHA two fifty six fingerprints for the dataset and its screening report. The server sends an actual transaction to a Solidity smart contract on a local Ethereum development chain. Here is the resulting ledger record, including the dataset fingerprint, transaction hash, contract address, and block number. A downloadable receipt preserves these details. The contract accepts writes only from its reviewer account and rejects duplicate dataset fingerprints. This development chain is not a public test network.'},
 @{image='05-integrity-match.png';text='Now we verify the original CSV against the ledger. The green integrity match confirms that its normalized measurements and analysis report agree with the anchored record in this session. Canonicalization is important: changing whitespace, reordering rows, or using an equivalent numeric format should not look like changed evidence. The fingerprint covers timestamps and temperature values. It does not cover the file name, additional columns, or the identity of the sensor site. Those limits are documented so reviewers can understand exactly what a successful match means.'},
 @{image='02-tamper-detection.png';text='This second file changes one temperature, from forty four point eight to forty three point eight degrees Celsius. Verification now reports no matching evidence. The changed measurements produce a different fingerprint. That is the core demonstration: an original dataset matches, while an altered copy does not. A mismatch can also mean a dataset was never anchored in this session, so the interface does not automatically accuse anyone of tampering. Automated tests cover changed values, equivalent formatting, invalid inputs, duplicate anchoring, and unauthorized contract callers.'},
 @{image='06-methodology.png';text='Integrity does not establish accuracy. A blockchain cannot prove that a sensor is calibrated or that an environmental claim is true. This prototype has one server controlled reviewer, uses synthetic data, and resets its chain when the server restarts. It makes no claim of carbon certification or measured emissions savings. The next steps are signed sensor identities, durable public chain anchoring, independent verification, and validation on real field datasets. The source, example CSV files, and run instructions are included for judges. Trace Climate: review the readings, preserve the evidence.'}
)
$concat = @()
for($i=0;$i -lt $scenes.Count;$i++) {
 $wav = Join-Path $videoWork "$i.wav"
 $speech.SetOutputToWaveFile($wav)
 $speech.Speak($scenes[$i].text)
 $speech.SetOutputToNull()
 $duration = [double](& ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $wav)
 $duration = [Math]::Max(30, $duration + 1.0)
 $frame = Join-Path (Split-Path $PSScriptRoot) ('submission/' + $scenes[$i].image)
 $segment = Join-Path $videoWork "$i.mp4"
 & ffmpeg -hide_banner -loglevel error -y -loop 1 -framerate 10 -i $frame -i $wav -vf 'scale=1440:960:force_original_aspect_ratio=decrease,pad=1440:960:(ow-iw)/2:(oh-ih)/2:white,setsar=1' -c:v libx264 -preset ultrafast -tune stillimage -crf 24 -pix_fmt yuv420p -c:a aac -b:a 96k -af apad -t $duration $segment
 if($LASTEXITCODE -ne 0){throw 'Video segment render failed'}
 $concat += "file '$i.mp4'"
 Write-Output "Scene $($i+1): $([Math]::Round($duration,1)) seconds"
}
$concat | Set-Content (Join-Path $videoWork 'concat.txt')
$output = Join-Path (Split-Path $PSScriptRoot) 'submission/TraceClimate-demo.mp4'
& ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i (Join-Path $videoWork 'concat.txt') -c copy -movflags +faststart $output
if($LASTEXITCODE -ne 0){throw 'Video assembly failed'}
$speech.Dispose()
& ffprobe -v error -show_entries format=duration,size -of json $output
